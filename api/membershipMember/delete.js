const util = require('./../util');
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_MEMBER;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const GSI_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];

const deleteHandler = async (event) => {
    const {membership_year} = event.pathParameters;
    const {user_name} = event.pathParameters;

    util.validate(membership_year);
    util.validate(user_name);

    const pk = HASH_KEY_PREFIX + membership_year;
    const sk = SORT_KEY_PREFIX + user_name;
    const gsi = GSI_PREFIX + user_name;
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

module.exports.handler = middy.middy(deleteHandler).use(middyLibs);

