'use strict';
const dynamoDb = require('../Dynamo');
const TABLE_NAME  = process.env.CONFIG_USER_TABLE;
const HASH_KEY_USER =process.env.HASH_KEY_USER;
const SORT_KEY_PREFIX_USER =process.env.SORT_KEY_PREFIX_USER;

const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createError = require('http-errors');
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

    let user= await dynamoDb.getByKeys(TABLE_NAME, HASH_KEY_USER, SORT_KEY_PREFIX_USER + userName);

    return user;
}
const handler = middy.middy(getOneHandler).use(middyLibs);

module.exports = {
    handler,
    getUser
}
