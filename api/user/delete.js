const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY_USER = process.env.HASH_KEY_USER;
const SORT_KEY_USER = process.env.SORT_KEY_USER;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createErrors = require('http-errors');

const deleteHandler = async (event) => {

    let {username} = event.pathParameters;


    try {
        await dynamoDb.remove(TABLE_NAME, HASH_KEY_USER + username, SORT_KEY_USER);

    } catch (err) {
        throw new createErrors.InternalServerError(err);
    }
    return {
        statusCode: 200,
    };
}
module.exports.handler = middy.middy(deleteHandler).use(middyLibs);
