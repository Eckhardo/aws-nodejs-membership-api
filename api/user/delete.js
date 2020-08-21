const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASK_KEY_PREFIX = 'user_';
const SORT_KEY_VALUE = 'profile';
exports.handler = async (event) => {

    const username = decodeURIComponent(event.pathParameters.username);
    const pk = HASK_KEY_PREFIX + username;
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
