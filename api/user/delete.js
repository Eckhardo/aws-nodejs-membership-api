const util = require('../util.js');
const TABLE_NAME =process.env.CONFIG_USER_TABLE;

const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const SORT_KEY_VALUE = process.env.SORT_KEY_USER_VALUE;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createErrors = require('http-errors');

const deleteHandler = async (event) => {

    let  {username} = event.pathParameters;

    const params = {
        TableName: TABLE_NAME,
        Key: {PK: HASH_KEY_PREFIX + username, SK: SORT_KEY_VALUE}
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
