const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const SORT_KEY_VALUE = process.env.SORT_KEY_USER_VALUE;


/**
 * Create new user
 *
 * Route: POST /user/
 */


exports.handler = async (event) => {
    console.log("create user.... started");
    const item = JSON.parse(event.body);
    util.validateItem(item, 'user_name'),
        item.PK = HASH_KEY_PREFIX + item.user_name;
    item.SK = SORT_KEY_VALUE;

    const params = {
        TableName: TABLE_NAME,
        Item: item
    };
    console.log("create.... item: ", item);

    try {
        // promised is resolved by .promise(), otherwise then((data) => ).catch((error) => )

        let data = await dynamoDb.put(params).promise();
        console.log("create.d... item: ", data);

        return util.make201Response(item);
    } catch (err) {
        util.makeErrorResponse(err);
    }

}
