const util = require('../util.js');
const middy = require('./../../lib/commonMiddleware');
const get = require('./get');
const createErrors = require('http-errors');
const createUserSchema = require('./../../lib/json-schema/user/createUser');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(),middy.httpCors()];
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const AWS = require('aws-sdk');
// const sqs = new AWS.SQS();

/**
 * Create new user
 * Route: POST /user/
 */
const createHandler = async (event) => {
    const {item} = event.body;
    const user_name = item.user_name;
    console.log('data from lambda authorizer:', event.requestContext.authorizer);
 /*   // receive email from lambda authorizer
    const {email} = event.requestContext.authorizer;

    console.log('email received from lambda authorizer:', email);
*/
    try {
        const theUser = await get.getUser(user_name);
        if (theUser) {
            throw new createErrors(400, `User with user name ${user_name}  already exists !`);
        }
        item.PK = process.env.HASH_KEY_PREFIX_USER + user_name;
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
        return util.make201Response(item);
    } catch (err) {
        console.error('Error:', err);
        throw new createErrors(err);
    }

}
const handler = middy.middy(createHandler);
handler.use(middyLibs).use(middy.validator({inputSchema: createUserSchema.schema}));


module.exports = {
    handler
}
