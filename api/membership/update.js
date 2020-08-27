const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE = process.env.SORT_KEY_MEMBERSHIP_VALUE;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;

/**
 *
 * @param event
 * @returns {Promise<{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: (*|number)}|{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: number}|{headers: {"Access-Control-Allow-Origin": string}, statusCode: number}>}
 */
exports.handler = async (event) => {

    const item = JSON.parse(event.body);
    const year = item.membership_year;
    util.validate(year);
    const pk = HASH_KEY_PREFIX + year;

    try {
        const params = {

            TableName: TABLE_NAME,
            Key: {PK: pk, SK: SORT_KEY_VALUE},
            UpdateExpression: "SET membership_name = :ms_name, is_active= :active, comments= :comments",
            ExpressionAttributeValues: {
                ":ms_name": item.membership_name,
                ":active": item.is_active,
                ":comments": item.comments
            },
            ReturnValues: "UPDATED_NEW"
        };

        let data = await dynamoDb.update(params).promise();
        return util.makeSingleResponseAttributes(data.Attributes);
    } catch (err) {
        return util.makeErrorResponse(err);
    }
}

