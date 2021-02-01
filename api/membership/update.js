const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE = process.env.SORT_KEY_MEMBERSHIP_VALUE;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const util = require('../util.js');
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const updateMsSchema = require('./../../lib/json-schema/membership/updateMembership');

/**
 *
 * @param event
 * @returns {Promise<{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: (*|number)}|{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: number}|{headers: {"Access-Control-Allow-Origin": string}, statusCode: number}>}
 */
const updateHandler = async (event) => {

    const {item} = event.body;
    const year = item.membership_year;
    util.validate(year);

    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {PK: HASH_KEY_PREFIX + year, SK: SORT_KEY_VALUE},
            UpdateExpression: "SET membership_name = :ms_name, is_active= :active, comments= :comments",
            ExpressionAttributeValues: {
                ":ms_name": item.membership_name,
                ":active": item.is_active,
                ":comments": item.comments
            },
            ReturnValues: "NONE"
        };
        let data = await dynamoDb.update(params).promise();
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200
    }
}

module.exports.handler = middy
    .middy(updateHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: updateMsSchema.schema}));

