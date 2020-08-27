'use strict';

const databaseManager = require('../../api/dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);

exports.handler = async () => {
    console.log('getEndedEvents::start');
    const now = new Date();
    const params = {
        TableName: TABLE_NAME,
        IndexName: 'statusEndingDate-Index',
        KeyConditionExpression: 'event_status =:event_status AND ending_date >= :now',
        ExpressionAttributeValues: {':event_status': 'OPEN', ':now': now.toISOString()}

    }

    const result = await dynamoDb.query(params).promise();
    console.log('getEndedEvents::result: ', result);
    return result.Items;

}