'use strict';


const TABLE_NAME = process.env.CONFIG_USER_TABLE_OFFLINE;
const HASH_KEY_PREFIX = process.env.HASH_KEY_USER;
const dynamoDb = require('../Dynamo');
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

    try {
        users = await dynamoDb.getAll(TABLE_NAME, HASH_KEY_PREFIX);
    } catch (err) {
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(users)
    }
}
module.exports.handler = middy.middy(getAllHandler).use(middyLibs);
