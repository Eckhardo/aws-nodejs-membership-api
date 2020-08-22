'use strict';

const util = require('../util.js');
const databaseManager = require('../dynamoDbConnect');

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const SORT_KEY_VALUE = process.env.SORT_KEY_USER_VALUE;

/**
 * GET all users by
 * Route: GET /user/
 */
module.exports.getAll = async (event) => {
   console.log("getOne.... pk_prefix:", HASH_KEY_PREFIX);
    console.log("getOne.... sortkey::", SORT_KEY_VALUE);

    let params = {
        TableName: TABLE_NAME,
        FilterExpression: "#sk = :sk_value",
        ExpressionAttributeNames: {
            "#sk": "SK",
        },
        ExpressionAttributeValues: {
            ":sk_value": SORT_KEY_VALUE
        }
    };
    try {
        // promised is resolved by .promise(), otherwise then((data) => ).catch((error) => )
        let data = await dynamoDb.scan(params).promise();
        return util.makeAllResponse(data);
    } catch (err) {
        util.makeErrorResponse(err);
    }
}


/**
 * Get one user by username
 *
 * The username is part of the hashkey, the sort key is a constant value.
 * Route: GET /user/{username}
 */

module.exports.getOne = async (event) => {

    const username = decodeURIComponent(event.pathParameters.username);
    const pk = HASH_KEY_PREFIX + username;
    console.log("getOne.... username:", username);
    console.log("getOne.... pk_prefix:", HASH_KEY_PREFIX);
    console.log("getOne.... sortkey::", SORT_KEY_VALUE);
    console.log("getOne.... pk:", pk);
    let params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': pk, ':sk': SORT_KEY_VALUE},
        Limit: 1
    };

    try {
        // promised is resolved by .promise(), otherwise then((data) => ).catch((error) => )
        let data = await dynamoDb.query(params).promise();
        return util.makeSingleResponse(data);
    } catch (err) {
        return util.makeErrorResponse(err);
    }
}
