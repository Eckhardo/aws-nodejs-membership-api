const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE= process.env.SORT_KEY_MEMBERSHIP_VALUE;
const HASH_KEY_PREFIX=process.env.HASH_KEY_PREFIX_MEMBERSHIP;



exports.handler = async (event) => {

        const item = JSON.parse(event.body);
        const year = item.membership_year;
        util.validate(year);
        const pk = HASH_KEY_PREFIX + year;

    try {
        const params = {

            TableName: TABLE_NAME,
            Key: {PK: pk, SK : SORT_KEY_VALUE},
            UpdateExpression: "SET membership_name = :ms_name, is_active= :active, comments= :comments",
            ExpressionAttributeValues: {
                ":ms_name": item.membership_name,
                ":active": item.is_active,
                ":comments": item.comments
            },

        };
        let data = await dynamoDb.update(params).promise();
        return util.makeSingleResponse(data);
    } catch (err) {
        return util.makeErrorResponse(err);
    }

}

