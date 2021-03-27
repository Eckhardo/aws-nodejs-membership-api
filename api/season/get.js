const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE = process.env.SORT_KEY_MEMBERSHIP_VALUE;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createError = require('http-errors');
const getAllHandler = async () => {
    let seasons;
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
        seasons = await dynamoDb.scan(params).promise();

    } catch (err) {
        throw new createError.InternalServerError(err)
    }
    return util.makeAllResponse(seasons);
}


/**
 *
 * @param event
 * @returns {Promise<{body: string, statusCode: number}>}
 */
const getOneHandler = async (event) => {
    let mySeason;
    const {year} = event.pathParameters;
    util.validate(year);

    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': HASH_KEY_PREFIX + year, ':sk': SORT_KEY_VALUE},
        Limit: 1

    }
    try {
        mySeason = await dynamoDb.query(params).promise();
    } catch (e) {
        throw new createError.InternalServerError(e)
    }
    if (!mySeason) {
        throw new createError.NotFound(`Membership for year "${year}" does not exist !`)
    }

    return util.makeSingleResponse(mySeason);


}

const getOne = middy.middy(getOneHandler).use(middyLibs);
const getAll = middy.middy(getAllHandler).use(middyLibs);

module.exports = {
    getAll,
    getOne
}
