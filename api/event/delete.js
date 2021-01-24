const util = require('./../util');
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE_OFFLINE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];

const deleteHandler = async (event) => {
    const year = decodeURIComponent(event.pathParameters.year);
    const eventName = decodeURIComponent(event.pathParameters.name);

    util.validate(year);
    util.validate(eventName);

    const pk = HASH_KEY_PREFIX + year;
    const sk = SORT_KEY_PREFIX + eventName;
    console.log("PK:", pk);
    console.log("SK:", sk);
    const params = {
        TableName: TABLE_NAME,
        Key: {PK: pk, SK: sk}
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
