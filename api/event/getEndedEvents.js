'use strict';

const databaseManager = require('../dynamoDbConnect');

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);


exports.handler = async () => {
    console.log('getEndedEvents::start');
    const now = new Date();
    const params = {
        TableName: TABLE_NAME,
        IndexName: 'statusEndingDate-Index',
        KeyConditionExpression: '#status =:status AND endingDate >= :now',
        ExpressionAttributeValues: {':status': 'OPEN', ':now': now.toISOString()},
        ExpressionAttributeNames: {'#status': 'status'}
    }

    const result = await dynamoDb.query(params).promise();
    console.log('getEndedEvents::result: ', result);
    return result.Items;

}
