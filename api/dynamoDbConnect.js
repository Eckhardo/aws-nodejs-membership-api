'use strict';

const AWS = require('aws-sdk');
let dynamoDb = new AWS.DynamoDB.DocumentClient();

const DYNAMODB_ENDPOINT = process.env.CONFIG_DYNAMODB_ENDPOINT;
const IS_OFFLINE = process.env.IS_OFFLINE;
module.exports.connectDynamoDB = tableName => {
    if (IS_OFFLINE === 'true') {
        console.log("offline db", tableName);
        dynamoDb = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: DYNAMODB_ENDPOINT,
        });
    }

    return dynamoDb;
}
