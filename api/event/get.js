'use strict';

const databaseManager = require('../dynamoDbConnect');

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);


const get = async (event) => {
    console.log('getEndedAuctions::start');
    const now = new Date();
    const params = {
        TableName: TABLE_NAME,
        IndexName: 'statusEndingDate-Index',
        KeyConditionExpression: '#status =:status AND endingDate >= :now',
        ExpressionAttributeValues: {':status': 'OPEN', ':now': now.toISOString()},
        ExpressionAttributeNames: {'#status': 'status'}
    }

    const result = await dynamoDb.query(params).promise();
    console.log('getEndedAuctions::result: ', result);
    return result.Items;

}
module.exports = {
    getEndedEvents: get
}
