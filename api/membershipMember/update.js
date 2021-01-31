const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_MEMBER;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const GSI_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createErrors = require('http-errors');
const updateMembershipMemberSchema = require('./../../lib/json-schema/membershipMember/updateMembershipMember');

/**
 * Update new Membership Member
 *
 * Route: POST /membershipMember/
 */


const updateHandler = async (event) => {

    const {item} = event.body;
    console.log("update membershipMember.... started:", item);
    item.PK = HASH_KEY_PREFIX + item.membership_year;
    item.SK = SORT_KEY_PREFIX + item.user_name;
    item.GSI1 = GSI_PREFIX + item.user_name;
    console.log("PK:", item.PK);
    console.log("SK:", item.SK);
    console.log("GSI:", item.GSI1);
    delete item.user_name;
    delete item.membership_year;

    try {
        const params = {

            TableName: TABLE_NAME,
            Key: {PK: item.PK, SK: SORT_KEY_PREFIX + item.user_name},

            UpdateExpression: "SET position_role = :role, is_active= :active, fees_paid= :fees_paid,GSI1: :GSI1",
            ExpressionAttributeValues: {
                ":active": item.is_active,
                ":fees_paid": item.fees_paid,
                ":role": item.position_role,
                ":GSI1": item.GSI1
            },
            ReturnValues: "UPDATED_NEW"
        };
        let data =   await dynamoDb.update(params).promise();
        console.log("updated: ", JSON.stringify(data));
        return util.make201Response(data.Item);
    } catch (err) {
        console.error('error:', err);
        throw new createErrors.InternalServerError(err);
    }

}
const handler = middy.middy(updateHandler);
handler.use(middyLibs).use(middy.validator({inputSchema: updateMembershipMemberSchema.schema}));
module.exports = {
    handler
}
