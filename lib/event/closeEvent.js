'use strict';

const databaseManager = require('../../api/dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
/**
 *
 * @param theEvent
 * @returns {Promise<DocumentClient.UpdateItemOutput & {$response: Response<DocumentClient.UpdateItemOutput, AWSError>}>}
 */
exports.handler = async (theEvent) => {


    const pk= theEvent.PK;
    const sk = theEvent.SK;

    const params = {
        TableName:TABLE_NAME,
        Key: {PK:pk, SK:sk },
        UpdateExpression: 'SET event_status = :event_status',
        ExpressionAttributeValues: {':event_status': 'CLOSED'}
    }
   return await dynamoDb.update(params).promise();

}
