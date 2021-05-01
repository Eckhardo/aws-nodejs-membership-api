const util = require('../util.js');
const middy = require('./../../lib/commonMiddleware');
const get = require('./get');
const createErrors = require('http-errors');

const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const AWS = require('aws-sdk');
// const sqs = new AWS.SQS();
const HASH_KEY_USER = process.env.HASH_KEY_USER;
const SORT_KEY_USER = process.env.SORT_KEY_USER;

/**
 * Create new user
 * Route: POST /user/
 *
 *
 * A Lambda authorizer for auth0 authentication is deactivated: THus the routine to put  a message
 * in the SQS message queue is uncommented.
 */
const loginHandler = async (event) => {
    let {item} = event.body;

    try {
        const theUser = await get.getUser(item.user_name);
        if (theUser) {
            const myUser = {
                "user_name": theUser.user_name,
                "first_name": theUser.first_name,
                "last_name": theUser.last_name,
                "is_admin": theUser.is_admin,
                "is_active": theUser.is_active
            }
            if (theUser.password === item.password) {
                console.log('login successful', myUser);
                return {
                    statusCode: 200,
                    body: JSON.stringify(myUser)
                };
            }
            else{
                return {
                    statusCode: 401
                };
            }
        }
        else{
            return {
                statusCode: 401
            };
        }
    } catch (err) {
        console.error("User unknown")
        throw new createErrors.InternalServerError(err);
    }
    return {
        statusCode: 401
    }
}
module.exports.handler = middy.middy(loginHandler).use(middyLibs);

