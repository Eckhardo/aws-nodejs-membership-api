const util = require('../util.js');
const middy = require('./../../lib/commonMiddleware');
const get = require('./get');
const createErrors = require('http-errors');
const createUserSchema = require('./../../lib/json-schema/user/createUser');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const AWS = require('aws-sdk');
// const sqs = new AWS.SQS();

/**
 * Create new user
 * Route: POST /user/
 *
 *
 * A Lambda authorizer for auth0 authentication is deactivated: THus the routine to put  a message
 * in the SQS message queue is uncommented.
 */
const createHandler = async (event) => {
    let {item} = event.body;

    //  console.log('data from lambda authorizer:', event.requestContext.authorizer);
    /*   // receive email from lambda authorizer
       const {email} = event.requestContext.authorizer;

       console.log('email received from lambda authorizer:', email);
   */
    try {
        const theUser = await get.getUser(item.user_name);
        if (theUser) {
            return {
                statusCode: 400,
                body: JSON.stringify(`User with user name ${item.user_name}  already exists !`)
            };
        }
        item.PK = process.env.HASH_KEY_PREFIX_USER + item.user_name;
        item.SK = process.env.SORT_KEY_USER_VALUE;
        //   item.email = email;

        const params = {
            TableName: TABLE_NAME,
            Item: item,
            ReturnValues: "NONE"
        };
        await dynamoDb.put(params).promise();

        /*       const notifyNewUser =  sqs.sendMessage({
                   QueueUrl : process.env.MAIL_QUEUE_URL,
                   MessageBody: JSON.stringify({
                       subject: 'You are registered as a new user!',
                       recipient: email,
                       body:` Your username is ${item.user_name}, you live in ${item.city}`
                   })
               }).promise();

             await  Promise.all([notifyNewUser]);
        */

    } catch (err) {
        throw new createErrors.InternalServerError(err);
    }
    return {
        statusCode: 201
    }
}
module.exports.handler = middy.middy(createHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: createUserSchema.schema}));

