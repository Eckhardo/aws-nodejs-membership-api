const util = require('../util.js');
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_MEMBER;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const GSI_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const createErrors = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(),middy.httpEventNormalizer(), middy.httpErrorHandler()];
const createMembershipMemberSchema = require('./../../lib/json-schema/membershipMember/createMembershipMember');
/**
 * Create new user
 *
 * Route: POST /user/
 */


const createHandler = async (event) => {

    const {item} = event.body;
    console.log("create membershipMember.... started", item);
    item.PK = HASH_KEY_PREFIX + item.membership_year;
    item.SK = SORT_KEY_PREFIX + item.user_name;
    item.GSI1 = GSI_PREFIX + item.user_name;
    console.log("PK:", item.PK);
    console.log("SK:", item.SK);
    console.log("GSI:", item.GSI1);
    delete item.user_name;
    delete item.membership_year;
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };


    try {
         let data = await dynamoDb.put(params).promise();
        console.log("created... item: ", item);
        return util.make201Response(item);
    } catch (err) {
        console.error('error:', err);
       throw new createErrors.InternalServerError(err);
    }

}
const handler = middy.middy(createHandler);
handler.use(middyLibs).use(middy.validator({inputSchema: createMembershipMemberSchema.schema}));
module.exports = {
    handler
}
