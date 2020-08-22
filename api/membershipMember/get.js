const util = require('../util.js');
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_MEMBER;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;


module.exports.getAll = async (event, context) => {
    console.log("getAll.... started");
    const year = decodeURIComponent(event.pathParameters.year);
    util.validate(year);
    const pk = HASH_KEY_PREFIX + year;
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
module.exports.getOne = async (event) => {
    console.log("getOne.... started");
    const year = decodeURIComponent(event.pathParameters.year);
    util.validate(year);
    const username = decodeURIComponent(event.pathParameters.username);
    util.validate(username);
    const pk = HASH_KEY_PREFIX + year;
    const sk = SORT_KEY_PREFIX + username;
    console.log("PK:", pk);
    console.log("SK:", sk);

    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': pk, ':sk': sk},
        Limit: 1

    }
    try {
        const result = await dynamoDb.query(params).promise();
        if (result) {
            return util.makeSingleResponse(result);
        }
    } catch (e) {
        util.makeErrorResponse(e);
    }

}
