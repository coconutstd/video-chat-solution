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

let tableName = "meetingInfoTable";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "meetingId";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/meeting-info";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

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
  let params = {
    TableName : tableName
  }
  dynamodb.scan(params, (err, data) => {
    if (err) {
      response.statusCode = 500;
      response.json({error: 'Could not load items' + err});
    } else {
      response.json(data.Items);
    }
  })
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/:id', function(request, response) {
  let params = {
    TableName: tableName,
    Key: {
      meetingId: request.params.id
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
  let params = {
    TableName: tableName,
    Key: {
      meetingId : request.body.meetingId
    },
    ExpressionAttributeValues: {},
    ReturnValues: 'ALL_NEW'
  }

  params.UpdateExpression = 'SET ';

  if(request.body.isEnded) {
    params.ExpressionAttributeValues[':isEnded'] = request.body.isEnded;
    params.UpdateExpression += 'isEnded = :isEnded, ';
  }
  if(request.body.attendee) {
    params.ExpressionAttributeValues[':attendee'] = [request.body.attendee];
    params.UpdateExpression += 'attendee_list = list_append(attendee_list, :attendee) ';
  }
  if(request.body.isEnded || request.attendee) {
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
      meetingId: request.body.meetingId,
      createdAt: request.body.createdAt,
      updatedAt: request.body.updatedAt,
      meeting_title: request.body.meeting_title,
      attendee_list: [request.body.attendee],
      isEnded: false
    },
    ConditionExpression: 'attribute_not_exists(meetingId)'
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
