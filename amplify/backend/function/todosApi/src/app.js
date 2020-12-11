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
const { v4: uuidv4 } = require('uuid')
AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "todosTable";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "id";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/todos";
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

const getUserId = request => {
  try {
    const reqContext = request.apiGateway.event.requestContext;
    const authProvider = reqContext.identity.cognitoAuthenticationProvider;
    return authProvider ? authProvider.split(":CognitoSignIn:").pop() : "UNAUTH";
  } catch (error) {
    return "UNAUTH";
  }
}

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

app.get("/todos", function(request, response){
  let params = {
    TableName: tableName,
    limit: 100
  }
  dynamodb.scan(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message })
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Items)})
    }
  })
})

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get("/todos/:id", function(request, response) {
  let params = {
    TableName: tableName,
    Key: {
      id: request.params.id
    }
  }
  dynamodb.get(params, (error, result) => {
    if (error) {
      response.json({ statusCode:500, error: error.message })
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Item)})
    }
  })

});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function(request, response) {
  const timestamp = new Date().toISOString()
  const params = {
    TableName: tableName,
    Key: {
      id: request.body.id,
    },
    ExpressionAttributeNames: { '#text': 'text' },
    ExpressionAttributeValues: {},
    ReturnValues: 'UPDATED_NEW'
  }
  params.UpdateExpression = 'SET'
  if (request.body.text) {
    params.ExpressionAttributeValues[':text'] = request.body.text
    params.UpdateExpression += '#text = :text, '
  }
  if (request.body.complete) {
    params.ExpressionAttributeValues[':complete'] = request.body.complete
    params.UpdateExpression += 'complete = :complete'
  }
  if (request.body.text || request.body.complete) {
    params.ExpressionAttributeValues[':updatedAt'] = timestamp
    params.UpdateExpression += 'updatedAt = :updatedAt'
  }
  dynamodb.update(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url })
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Attributes)})
    }
  })
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(request, response) {
  const timestamp = new Date().toISOString()
  let params = {
    TableName: tableName,
    Item: {
      ...request.body,
      id: uuidv4(),
      complete: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      userId: getUserId(request)
    }
  }

  dynamodb.put(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url })
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(params.Item)})
    }
  })
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  let params = {
    TableName: tableName,
    Key: {
      id: request.params.id
    }
  }
  dynamodb.delete(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url })
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result) })
    }
  })
});
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
