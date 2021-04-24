const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo')

const SORT_KEY = process.env.HASH_KEY_USER;

const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const get = require('./get');

const deleteHandler = async (event) => {

    const {year,event_name, user_name} = event.pathParameters;

    try {
        await dynamoDb.remove(TABLE_NAME, year + event_name, SORT_KEY + user_name);
    } catch (err) {
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200
    };
}

module.exports.handler = middy.middy(deleteHandler).use(middyLibs);

