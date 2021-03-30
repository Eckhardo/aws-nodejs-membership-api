const util = require('./../util');

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo')
const HASH_KEY = process.env.HASH_KEY_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];
const createError = require('http-errors');
const deleteHandler = async (event) => {
    const {SK} = event.pathParameters;
    console.log("delete event::", SK);
    util.validate(SK);


    try {
        await dynamoDb.remove(TABLE_NAME, HASH_KEY, SK);

    } catch (err) {
        throw  new createError.InternalServerError(err);
    }
    return {
        statusCode: 200
    };
}

module.exports.handler = middy.middy(deleteHandler).use(middyLibs);
