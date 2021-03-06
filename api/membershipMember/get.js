const util = require('../util.js');
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_MEMBER;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];
const createError = require('http-errors');

const getAllHandler = async (event) => {
    let myMembershipMembers;
    const {year} = event.pathParameters;
    util.validate(year);

    let params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        ExpressionAttributeValues: {":pk": HASH_KEY_PREFIX + year, ":sk": SORT_KEY_PREFIX}
    };
    try {
        myMembershipMembers = await dynamoDb.query(params).promise();
        myMembershipMembers.Items = myMembershipMembers.Items.map(item => {
            const gsi = item.GSI1;
            const index = gsi.indexOf('_');
            item.user_name = gsi.slice(index + 1);
            return item;
        });

    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return util.makeAllResponse(myMembershipMembers);
}

/**
 *
 * @param event
 * @returns {Promise<{headers: {"Access-Control-Allow-Origin": string, "Access-Control-Allow-Credentials": boolean}, body: string, statusCode: number}>}
 */
const getOneHandler = async (event) => {
    let myMembershipMember;
    const {membership_year} = event.pathParameters;

    const {user_name} = event.pathParameters;
    util.validate(membership_year);
    util.validate(user_name);


    try {
        myMembershipMember = await getMembershipMember(membership_year, user_name);

    } catch (err) {

        throw new createError.InternalServerError(err);
    }
    if (myMembershipMember) {
        return {
            statusCode: 200,
            body: JSON.stringify(myMembershipMember)
        };
    } else {
        throw new createError(404, `Membership Member for year ${membership_year} with user name ${user_name}  does not exist !`);
    }

}
const getMembershipMember = async (year, name) => {

    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': HASH_KEY_PREFIX + year, ':sk': SORT_KEY_PREFIX + name},
        Limit: 1

    }

    let data = await dynamoDb.query(params).promise();
    if (data && data.Items.length > 0) {
        return data.Items[0];
    } else {
        return null;
    }
}
const getOne = middy.middy(getOneHandler).use(middyLibs);
const getAll = middy.middy(getAllHandler).use(middyLibs);

module.exports = {
    getAll,
    getOne,
    getMembershipMember
}
