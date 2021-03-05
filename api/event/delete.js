const util = require('./../util');

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo')
const HASH_KEY= process.env.HASH_KEY_EVENT;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_EVENT;const databaseManager = require('../dynamoDbConnect');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];
const createError = require('http-errors');
const deleteHandler = async (event) => {
     const {name} = event.pathParameters;
    console.log("delete event::", name);
    util.validate(name);


    try {
        await dynamoDb.remove(TABLE_NAME, HASH_KEY, SORT_KEY_PREFIX + name);

    } catch (err) {
        throw  new createError.InternalServerError(err);
    }
    return {
        statusCode: 200
    };
}

module.exports.handler = middy.middy(deleteHandler).use(middyLibs);
