'use strict';

const databaseManager = require('../dynamoDbConnect');

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);

exports.handler = async (theEvent) => {


    const pk= theEvent.PK;
    const sk = theEvent.SK;

    const params = {
        TableName:TABLE_NAME,
        Key: {PK:pk, SK:sk },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeValues: {':status': 'CLOSED'},
        ExpressionAttributeNames:{'#status': 'status'}
    }
    const result =await dynamoDb.update(params).promise();
    return result;


}
