const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const SORT_KEY_VALUE = process.env.SORT_KEY_USER_VALUE;

exports.handler = async (event) => {

    const username = decodeURIComponent(event.pathParameters.username);
    const pk = HASH_KEY_PREFIX + username;
    const params = {
        TableName: TABLE_NAME,
        Key: {
            PK: pk,
            SK: SORT_KEY_VALUE
        }

    };
    try {
        const result = await dynamoDb.delete(params).promise();
        return {
            statusCode: 200,
            headers: util.getResponseHeaders()
        };
    } catch (err) {
        return util.makeErrorResponse(err);
    }
}