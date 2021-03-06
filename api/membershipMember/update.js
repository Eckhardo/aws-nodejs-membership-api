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
    item.PK = HASH_KEY_PREFIX + item.membership_year;
    item.SK = SORT_KEY_PREFIX + item.user_name;
    item.GSI1 = GSI_PREFIX + item.user_name;
    delete item.user_name;
    delete item.membership_year;

    try {
        const params = {

            TableName: TABLE_NAME,
            Key: {PK: item.PK, SK: item.SK},

            UpdateExpression: "SET position_role = :role, is_active= :active, fees_paid= :fees_paid,GSI1 = :GSI1",
            ExpressionAttributeValues: {
                ":active": item.is_active,
                ":fees_paid": item.fees_paid,
                ":role": item.position_role,
                ":GSI1": item.GSI1
            },
            ReturnValues: "NONE"
        };
        await dynamoDb.update(params).promise();


    } catch (err) {

        throw new createErrors.InternalServerError(err);
    }
    return {
        statusCode: 200
    }

}
module.exports.handler = middy
    .middy(updateHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: updateMembershipMemberSchema.schema}));

