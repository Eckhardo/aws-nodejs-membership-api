const util = require('../util.js');
const middy = require('./../../lib/commonMiddleware');
const get = require('./get');
const createErrors = require('http-errors');
const createUserSchema = require('./../../lib/json-schema/user/createUser');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler()];
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);


/**
 * Create new user
 * Route: POST /user/
 */
const createHandler = async (event) => {
    const {item} = event.body;
    const user_name = item.user_name;

    try {
        const theUser = await get.getUser(user_name);
        console.log('.... theUser', theUser);
        if (theUser) {
            throw new createErrors(400, `User with user name ${user_name}  already exists !`);
        }
        item.PK = process.env.HASH_KEY_PREFIX_USER + user_name;
        item.SK = process.env.SORT_KEY_USER_VALUE;

        const params = {
            TableName: TABLE_NAME,
            Item: item,
            ReturnValues: "NONE"
        };
        await dynamoDb.put(params).promise();
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
