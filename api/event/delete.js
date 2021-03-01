const util = require('./../util');
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY= process.env.HASH_KEY_EVENT;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_EVENT;const databaseManager = require('../dynamoDbConnect');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];
const createError = require('http-errors');
const deleteHandler = async (event) => {
     const {name} = event.pathParameters;
    console.log( name);
    util.validate(name);


    const params = {
        TableName: TABLE_NAME,
        Key: {PK: HASH_KEY, SK: SORT_KEY_PREFIX + name}
    };
    try {
        await dynamoDb.delete(params).promise();

    } catch (err) {
        throw  new createError.InternalServerError(err);
    }
    return {
        statusCode: 200
    };
}

module.exports.handler = middy.middy(deleteHandler).use(middyLibs);
