'use strict';


const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME =process.env.CONFIG_USER_TABLE_OFFLINE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const util = require('../util');
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];

/**
 * GET all users by sort key = profile
 *
 * One should consider to establish a GSI with PK = profile and SK = user_
 * Route: GET /user/
 */
const getAllHandler = async () => {
 let users;
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: '#sk = :sk_value',
        ExpressionAttributeNames: {'#sk': 'SK',},
        ExpressionAttributeValues: {
            ':sk_value': process.env.SORT_KEY_USER_VALUE
        }
    };
    try {
        users= await dynamoDb.scan(params).promise();

    } catch (err) {
         throw new createError.InternalServerError(err);
    }
    return util.makeAllResponse(users);
}
module.exports.handler= middy.middy(getAllHandler).use(middyLibs);
