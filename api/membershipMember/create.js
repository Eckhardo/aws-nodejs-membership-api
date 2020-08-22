const util = require('../util.js');
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_MEMBER;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const GSI_PREFIX= process.env.HASH_KEY_PREFIX_USER;

/**
 * Create new user
 *
 * Route: POST /user/
 */


exports.handler = async (event) => {

    const item = JSON.parse(event.body);
    console.log("create membershipMember.... started", item);
    util.validateItem(item, 'user_name');
    util.validateItem(item, 'membership_year'),
    item.PK = HASH_KEY_PREFIX + item.membership_year;
    item.SK = SORT_KEY_PREFIX + item.user_name;
    item.GSI1= GSI_PREFIX + item.user_name;
    console.log("PK:", item.PK);
    console.log("SK:", item.SK);
    console.log("GSI:", item.GSI1);
    delete item.user_name;
    delete item.membership_year;
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };


    try {
        // promised is resolved by .promise(), otherwise then((data) => ).catch((error) => )

        let data = await dynamoDb.put(params).promise();
        console.log("create.d... item: ", data);
        return util.makeSingleResponse(data);
    } catch (err) {
        util.makeErrorResponse(err);
    }

}
