'use strict';


const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME =process.env.CONFIG_USER_TABLE_OFFLINE;
const HASH_KEY_PREFIX =process.env.HASH_KEY_USER;
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
        KeyConditionExpression: 'PK = :pk ',
        ExpressionAttributeValues: {':pk': HASH_KEY_PREFIX},
    }

    try {
        users = await dynamoDb.query(params).promise();
    } catch (err) {
         throw new createError.InternalServerError(err);
    }
    return util.makeAllResponse(users);
}
module.exports.handler= middy.middy(getAllHandler).use(middyLibs);
