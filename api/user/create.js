
const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE='profile';
const HASK_KEY_PREFIX='user_';

/**
 * Create new user
 *
 * Route: POST /user/
 */
const validate= (username) => {

    if ( username && typeof username !== 'string' ) {
        throw Error("key value 'username' not set or not of type string");
    }

}

exports.handler = async (event) => {
    const item = JSON.parse(event.body);
    const username=item.user_name;
    validate(username);
    item.PK = HASK_KEY_PREFIX + username;
    item.SK = SORT_KEY_VALUE;

    const params = {
        TableName: TABLE_NAME,
        Item: item
    };
    console.log("getOne.... started", item);

    try {
        // promised is resolved by .promise(), otherwise then((data) => ).catch((error) => )

        let data = await dynamoDb.put(params).promise();
        return util.makeSingleResponse(data);
    } catch (err) {
        util.makeErrorResponse(err);
    }

}
