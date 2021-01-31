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
    console.log("getAll.... started");
    const {membership_year} = event.pathParameters;
    util.validate(membership_year);
    const pk = HASH_KEY_PREFIX + membership_year;
    console.log("PK:", pk);
    console.log("SK:", SORT_KEY_PREFIX);

    let params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        ExpressionAttributeValues: {":pk": pk, ":sk": SORT_KEY_PREFIX}
    };
    try {
        let data = await dynamoDb.query(params).promise();
        console.log("original data:", data);
        data.Items = data.Items.map(item => {
            const gsi = item.GSI1;
            const index = gsi.indexOf('_');
            item.user_name = gsi.slice(index + 1);
            return item;
        });

        console.log("modified data:", data);
        return util.makeAllResponse(data);
    } catch (err) {
        util.makeErrorResponse(err);
    }
}
const getOneHandler = async (event) => {
    console.log("getOne.... started");
    const {membership_year} = event.pathParameters;
    util.validate(membership_year);
    const {user_name} = event.pathParameters;
    util.validate(user_name);


    try {
        const membershipMember =await getMembershipMember(membership_year, user_name);
        console.log("getOne.... result:",membershipMember);
        if (membershipMember) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(membershipMember)
            };
        } else {
            throw new createError(204, `Membership Member for year ${membership_year} with user name ${user_name}  does not exist !`);
        }
    } catch (err) {
        console.error('Error:', err);
        throw new createError.InternalServerError(err);
    }

}
const getMembershipMember = async (year, name) => {
    const pk = HASH_KEY_PREFIX + year;
    const sk = SORT_KEY_PREFIX + name;


    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': pk, ':sk': sk},
        Limit: 1

    }

    let data = await dynamoDb.query(params).promise();
    if (data && data.Items.length > 0) {
        return data.Items[0];
    } else {
        console.log('membership Member not found !');
        return null;
    }
}
const getOne = middy.middy(getOneHandler);
getOne.use(middyLibs);
const getAll = middy.middy(getAllHandler);
getAll.use(middyLibs);

module.exports = {
    getAll,
    getOne,
    getMembershipMember
}
