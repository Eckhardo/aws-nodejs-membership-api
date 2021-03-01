const util = require('../util.js');
const TABLE_NAME =process.env.CONFIG_USER_TABLE;

const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_USER =process.env.HASH_KEY_USER;
const SORT_KEY_PREFIX_USER =process.env.SORT_KEY_PREFIX_USER;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createErrors = require('http-errors');

const deleteHandler = async (event) => {

    let  {username} = event.pathParameters;

    const params = {
        TableName: TABLE_NAME,
        Key: {PK: HASH_KEY_USER , SK: SORT_KEY_PREFIX_USER + username}
    };
    try {
        await dynamoDb.delete(params).promise();

    } catch (err) {
        throw new createErrors.InternalServerError(err);
    }
    return {
        statusCode: 200,
        headers: util.getResponseHeaders()
    };
}
module.exports.handler = middy.middy(deleteHandler).use(middyLibs);
