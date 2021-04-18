const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo')
const HASH_KEY = process.env.HASH_KEY_USER;
const SORT_KEY = process.env.SORT_KEY_EVENT;

const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const get = require('./get');

const deleteHandler = async (event) => {

    return {
        statusCode: 200
    };
}

module.exports.handler = middy.middy(deleteHandler).use(middyLibs);

