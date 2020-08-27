'use strict';

const util = require('../util');
const middy = require('@middy/core');
const httpEventNormalizer = require('@middy/http-event-normalizer'); //Normalizes HTTP events by adding an empty object for queryStringParameters
const httpErrorHandler = require('@middy/http-error-handler'); // handles common http errors and returns proper responses
const databaseManager = require('../dynamoDbConnect');
const createErrors = require('http-errors');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const SORT_KEY_VALUE = process.env.SORT_KEY_USER_VALUE;

const middlewares = [httpEventNormalizer(), httpErrorHandler()]
/**
 * GET all users by sort key = profile
 *
 * One should consider to establish a GSI with PK = profile and SK = user_
 * Route: GET /user/
 */
const getAllHandler = async () => {

    const params = {
        TableName: TABLE_NAME,
        FilterExpression: '#sk = :sk_value',
        ExpressionAttributeNames: {'#sk': 'SK',},
        ExpressionAttributeValues: {
            ':sk_value': SORT_KEY_VALUE
        }
    };
    try {
        // promised is resolved by .promise(), otherwise then((data) => ).catch((error) => )
        let data = await dynamoDb.scan(params).promise();
        return util.makeAllResponse(data);
    } catch (err) {
        console.log("Error: ", err);
        throw new createErrors.InternalServerError(err);
    }
}


const getOneHandler = async (event) => {
    console.log("getOne:: ");
    console.log("getOne:: username: ", event.pathParameters.username);
    const username = decodeURIComponent(event.pathParameters.username);
    let user;
    try {
        user = await getUser(username);
        if (user) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(user)
            };
        } else {
            throw new  createErrors(404, `User with user name ${username}  does not exist !`);
        }
    } catch (err) {
        console.error('Error:', err);
        throw new createErrors(err);
    }
}

/**
 * Get one user by username
 *
 * The username is part of the hashkey, the sort key is a constant value.
 *
 */

const getUser = async (userName) => {
    const pk = HASH_KEY_PREFIX + userName;
    let params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': pk, ':sk': SORT_KEY_VALUE},
        Limit: 1
    };
    let data = await dynamoDb.query(params).promise();
    console.log('getUser::data:', data);
    if (data && data.Items.length > 0) {
        return data.Items[0];
    } else {
        console.log('uer not found !');
        return null;
    }
}
const getOne = middy(getOneHandler);
getOne.use(middlewares);
const getAll = middy(getAllHandler);
getAll.use(middlewares);

module.exports = {
    getAll,
    getOne,
    getUser
}
