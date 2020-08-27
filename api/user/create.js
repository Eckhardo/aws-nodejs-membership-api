const util = require('../util.js');
const get = require('./get');
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');// parses the request body when it's a JSON and converts it to an object
const httpEventNormalizer = require('@middy/http-event-normalizer'); //Normalizes HTTP events by adding an empty object for queryStringParameters
const httpErrorHandler = require('@middy/http-error-handler'); // handles common http errors and returns proper responses
const validator = require('@middy/validator');
const createErrors = require('http-errors');
const createUserSchema = require('./../../lib/json-schema/user/createUser');
const middlewares = [httpJsonBodyParser(), httpEventNormalizer(), httpErrorHandler()]

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


createHandler = async (event) => {
     const {item, user_name} = event.body;

    try {
        const theUser = await get.getUser(user_name);
        console.log('.... theUser', theUser);
        if (theUser) {
          throw new createErrors(400, `User with user name ${user_name}  already exists !`);
        }
        item.PK = HASH_KEY_PREFIX + user_name;
        item.SK = SORT_KEY_VALUE;

        const params = {
            TableName: TABLE_NAME,
            Item: item
        };
       let data = await dynamoDb.put(params).promise();
         return util.make201Response(item);
    } catch (err) {
        console.error('Error:', err);
        throw new createErrors(err);
    }

}



const handler = middy(createHandler);
handler.use(middlewares).use(validator({inputSchema: createUserSchema.schema}));


module.exports = {
    handler
}
