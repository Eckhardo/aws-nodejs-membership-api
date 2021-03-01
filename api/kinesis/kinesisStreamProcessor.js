'use strict';
const AWS = require('aws-sdk');

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
/**
 * A lambda function with a Kinesis Data Stream as an event source.
 *
 * Converts the kinesis data stream data into json format and subsequently persists
 * these records into dynamodb.
 * @param event
 * @returns {Promise<void>}
 */
exports.handler = async (event) => {

    try {
        let items = event.Records.map((record) => {
            let jsonData = new Buffer(record.kinesis.data, 'base64').toString('ascii');
            let item = JSON.parse(jsonData);
            let putRequest = {
                PutRequest: {
                    Item: item
                }
            }
            return putRequest;
        })
        let params = {
            RequestItems: {
                [TABLE_NAME]: items
            }
        }

        await dynamoDb.batchWrite(params).promise();

    } catch (err) {
        console.log('ERROR:', err);
        throw new Error(err);

    }

}

