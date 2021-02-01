
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE = process.env.SORT_KEY_MEMBERSHIP_VALUE;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const util = require('../util.js');
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(),middy.httpCors()];
const createMsSchema = require('./../../lib/json-schema/membership/createMembership');
/**
 * Create new membership
 *
 * Route: POST /membership/
 */


const createHandler = async (event) => {
    const {item} = event.body;
    const year = item.membership_year;
    util.validate(year);
    item.PK = HASH_KEY_PREFIX + year;
    item.SK = SORT_KEY_VALUE;

    const params = {
        TableName: TABLE_NAME,
        Item: item
    };
    console.log("create.... item: ", item);

    try {
        let data = await dynamoDb.put(params).promise();

    } catch (err) {
        throw new createError.InternalServerError(err);

    }
    return {
        statusCode: 201
    }


}
module.exports.handler = middy
    .middy(createHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: createMsSchema.schema}));
