'use strict';

const util = require('../util');
const databaseManager = require('../dynamoDbConnect');
const createError = require('http-errors');
const TABLE_NAME = process.env.CONFIG_USER_TABLE_OFFLINE;

const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];

const getOneHandler = async (event) => {
    let user;
    const {username} = event.pathParameters;
    console.log("getOne:: " + username);

    try {
        user = await getUser(username);

    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    if(! user) {
        throw new createError.NotFound(`User with name "${username}" not found !`)

    }
    return {
        statusCode: 200,
        body: JSON.stringify(user)
    }
}

/**
 * Get one user by username
 *
 * The username is part of the hashkey, the sort key is a constant value.
 *
 */

const getUser = async (userName) => {
    let user;
    let params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {
            ':pk': process.env.HASH_KEY_PREFIX_USER + userName,
            ':sk': process.env.SORT_KEY_USER_VALUE
        },
        Limit: 1
    };
    let data = await dynamoDb.query(params).promise();
    if (data && data.Items.length > 0) {
        user = data.Items[0];

    }
    return user;
}
const handler = middy.middy(getOneHandler).use(middyLibs);

module.exports = {
    handler,
    getUser
}
