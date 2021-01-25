const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE_OFFLINE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE = process.env.SORT_KEY_MEMBERSHIP_VALUE;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(),middy.httpCors()];

const getAllHandler = async () => {
    console.log("getAll.... started");
    let params = {
        TableName: TABLE_NAME,
        FilterExpression: "#sk = :sk_value",
        ExpressionAttributeNames: {
            "#sk": "SK",
        },
        ExpressionAttributeValues: {
            ":sk_value": SORT_KEY_VALUE
        }
    };
    try {
        // promised is resolved by .promise(), otherwise then((data) => ).catch((error) => )
        let data = await dynamoDb.scan(params).promise();
        return util.makeAllResponse(data);
    } catch (err) {
        util.makeErrorResponse(err);
    }
}
const getOneHandler = async (event) => {
    console.log("getOne.... started");
    const year = decodeURIComponent(event.pathParameters.year);
    util.validate(year);
    const pk = HASH_KEY_PREFIX + year;

    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': pk, ':sk': SORT_KEY_VALUE},
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

const getOne = middy.middy(getOneHandler);
getOne.use(middyLibs);
const getAll = middy.middy(getAllHandler);
getAll.use(middyLibs);

module.exports = {
    getAll,
    getOne
}
