'use strict';

const util = require('../util');
const databaseManager = require('../dynamoDbConnect');
const createError = require('http-errors');
const TABLE_NAME =process.env.CONFIG_USER_TABLE_OFFLINE;

const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];

/**
 * GET all users by sort key = profile
 *
 * One should consider to establish a GSI with PK = profile and SK = user_
 * Route: GET /user/
 */
const getAllHandler = async () => {
    console.log("getAllHandler: Table Name::" + JSON.stringify(TABLE_NAME));
    console.log("isOffline::" + process.env.IS_OFFLINE);

    const params = {
        TableName: TABLE_NAME,
        FilterExpression: '#sk = :sk_value',
        ExpressionAttributeNames: {'#sk': 'SK',},
        ExpressionAttributeValues: {
            ':sk_value': process.env.SORT_KEY_USER_VALUE
        }
    };
    try {
        let data = await dynamoDb.scan(params).promise();
        return util.makeAllResponse(data);
    } catch (err) {
        console.error("Error: ", err);
        throw new createError.InternalServerError(err);
    }
}
const handler = middy.middy(getAllHandler).use(middyLibs);

module.exports = {
    handler
}
