const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE= process.env.SORT_KEY_MEMBERSHIP_VALUE;
const HASH_KEY_PREFIX=process.env.HASH_KEY_PREFIX_MEMBERSHIP;

/**
 * Create new membership
 *
 * Route: POST /membership/
 */


exports.handler = async (event) => {
    const item = JSON.parse(event.body);
    const year=item.membership_year;
    util.validate(year);
    item.PK = HASH_KEY_PREFIX + year;
    item.SK = SORT_KEY_VALUE;

    const params = {
        TableName: TABLE_NAME,
        Item: item
    };
    console.log("create.... item: ", item);

    try {
        let data = await dynamoDb.put(params).promise();
        return util.make201Response(item);
    } catch (err) {
        util.makeErrorResponse(err);
    }

}
