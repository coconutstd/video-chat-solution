/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "userTable";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "userId";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/user";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

const getUserId = request => {
  try {
    const reqContext = request.apiGateway.event.requestContext;
    const authProvider = reqContext.identity.cognitoAuthenticationProvider;
    return authProvider ? authProvider.split(":CognitoSignIn:").pop() : "UNAUTH";
  } catch (error) {
    return "UNAUTH";
  }
}

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path, function(request, response) {

  let queryParams = {
    TableName: tableName,
  }

  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      response.statusCode = 500;
      response.json({error: 'Could not load items: ' + err});
    } else {
      response.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/:id', function(request, response) {
  let params = {
    TableName: tableName,
    Key: {
      userId: request.params.id
    }
  }

  dynamodb.get(params,(err, data) => {
    if(err) {
      response.statusCode = 500;
      response.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        response.json(data.Item);
      } else {
        response.json(data) ;
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function(request, response) {
  console.log(request);
  let params = {
    TableName: tableName,
    Key: {
      userId: getUserId(request)
    },
    ExpressionAttributeNames: {'#name' : null},
    ExpressionAttributeValues: {},
    ReturnValues: 'ALL_NEW'
  }

  params.UpdateExpression = 'SET ';

  if(request.body.isTeacher) {
    params.ExpressionAttributeValues[':isTeacher'] = request.body.isTeacher;
    params.UpdateExpression += 'isTeacher = :isTeacher, ';
  }
  if(request.body.name) {
    params.ExpressionAttributeNames['#name'] = 'name';
    params.ExpressionAttributeValues[':name'] = request.body.name;
    params.UpdateExpression += '#name = :name, ';
  }
  if(request.body.isTeacher || request.body.name) {
    params.ExpressionAttributeValues[':updatedAt'] = request.body.updatedAt;
    params.UpdateExpression += 'updatedAt = :updatedAt';
  }

  console.log(params.ExpressionAttributeValues);

  dynamodb.update(params, (err, data) => {
    if(err) {
      response.statusCode = 500;
      response.json({error: err, url: request.url, body: request.body});
    } else{
      response.json({success: 'put call succeed!', url: request.url, data: data})
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(request, response) {

  let params = {
    TableName: tableName,
    Item: {
      userId: getUserId(request),
    },
    ConditionExpression: 'attribute_not_exists(userId)'
  }
  dynamodb.put(params, (err, data) => {
    if(err) {
      response.statusCode = 500;
      response.json({error: err, url: request.url, body: request.body});
    } else{
      response.json({success: 'post call succeed!', url: request.url, data: data})
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });
});
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
