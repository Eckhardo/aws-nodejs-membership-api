const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE_OFFLINE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE = process.env.SORT_KEY_MEMBERSHIP_VALUE;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(),middy.httpCors()];


const deleteHandler = async (event) => {

    const year = decodeURIComponent(event.pathParameters.year);
    const pk = HASH_KEY_PREFIX + year;
    const params = {
        TableName: TABLE_NAME,
        Key: {PK: pk, SK: SORT_KEY_VALUE}
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


const handler = middy.middy(deleteHandler);
handler.use(middyLibs);
module.exports = {
    handler
}
