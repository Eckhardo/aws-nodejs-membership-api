'use strict';

const util = require('../util');
const databaseManager = require('../dynamoDbConnect');
const createError = require('http-errors');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];

const getOneHandler = async (event) => {
    console.log("getOne:: ");
     const username = decodeURIComponent(event.pathParameters.username);
    let user;
    try {
        user = await getUser(username);
        if (user) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(user)
            };
        } else {
            throw new createError(404, `User with user name ${username}  does not exist !`);
        }
    } catch (err) {
        console.error('Error:', err);
        throw new createError(err);
    }
}

/**
 * Get one user by username
 *
 * The username is part of the hashkey, the sort key is a constant value.
 *
 */

const getUser = async (userName) => {
    let params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {
            ':pk': process.env.HASH_KEY_PREFIX_USER + userName,
            ':sk': process.env.SORT_KEY_USER_VALUE},
        Limit: 1
    };
    let data = await dynamoDb.query(params).promise();
    console.log('getUser::data:', data);
    if (data && data.Items.length > 0) {
        return data.Items[0];
    } else {
        console.log('uer not found !');
        return null;
    }
}
const handler = middy.middy(getOneHandler);
handler.use(middyLibs);

module.exports = {
    handler,
    getUser
}
