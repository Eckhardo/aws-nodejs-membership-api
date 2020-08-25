const util = require('./../util');
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_MEMBER;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const GSI_PREFIX = process.env.HASH_KEY_PREFIX_USER;

exports.handler = async (event) => {
    const year = decodeURIComponent(event.pathParameters.year);
    const username = decodeURIComponent(event.pathParameters.username);

    util.validate(year);
    util.validate(username);

    const pk = HASH_KEY_PREFIX + year;
    const sk = SORT_KEY_PREFIX + username;
    const gsi = GSI_PREFIX + username;
    console.log("PK:", pk);
    console.log("SK:", sk);
    console.log("GSI:", gsi);
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
