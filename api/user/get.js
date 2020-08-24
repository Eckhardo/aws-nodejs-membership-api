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
const getAll = async (event) => {

    let params = {
        TableName: TABLE_NAME,
        FilterExpression: "#sk = :sk_value",
        ExpressionAttributeNames: {"#sk": "SK",},
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

const getUser = async (username) => {
    console.log("getUser:: ", username);
    const pk = HASH_KEY_PREFIX + username;
    let params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': pk, ':sk': SORT_KEY_VALUE},
        Limit: 1
    };
    let user;
    console.log("getUser::PK ", pk);
    try {
        let data = await dynamoDb.query(params).promise();
        user = data.Items[0];
        console.log("return data", data);
        return user;
    } catch (err) {
        return util.makeErrorResponse(err);
    }


}
const getOne = async (event) => {
    const username = decodeURIComponent(event.pathParameters.username);
    console.log("getOne:: ", username);
    let user = await getUser(username);
    if (user) {
        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(user)
        };
    } else {
        return {
            statusCode: 404,
            headers: util.getResponseHeaders()
        };
    }
}

module.exports = {
    getUser,
    getOne,
    getAll
}
