'use strict';

const util = require('../util.js');

const databaseManager = require('../dynamoDbConnect');

const TABLE_NAME = process.env.CONFIG_USER_TABLE_OFFLINE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];

/**
 * GET all events for a distinct year
 * Route: GET /event/{year}
 */
const getAllHandler = async (event) => {
    const year = decodeURIComponent(event.pathParameters.year);
    util.validate(year);
    const pk = HASH_KEY_PREFIX + year;
    console.log("getAll:: PK ", pk);
    console.log("getAll:: SK begins with ", SORT_KEY_PREFIX);
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
        ExpressionAttributeValues: {':pk': pk, ':sk': SORT_KEY_PREFIX},
    }

    try {
        let data = await dynamoDb.query(params).promise();
         return util.makeAllResponse(data);
    } catch (err) {
        util.makeErrorResponse(err);
    }
}


/**
 * Retrieve an event for a distinct year and name
 * Route: GET /event/{year}/{name}
 */
const getOneHandler = async (event) => {
    const year = decodeURIComponent(event.pathParameters.year);
    const name = decodeURIComponent(event.pathParameters.name);
    util.validate(year);
    util.validate(name);
    console.log("getOne:: ", year, name);

    try {
        let myEvent = await getEvent(year, name);
        if (myEvent) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(myEvent)
            };
        } else {
            return {
                statusCode: 404,
                headers: util.getResponseHeaders()
            };
        }
    } catch (e) {
        return util.makeErrorResponse(e);
    }
}


/**
 * Retrieve an event for a distinct year and name
 */
const getEvent = async (year, name) => {
    util.validate(year);
    util.validate(name);
    console.log("getEvent:: ", year, name);

    const pk = HASH_KEY_PREFIX + year;
    const sk = SORT_KEY_PREFIX + name;

    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': pk, ':sk': sk},
        Limit: 1
    }
    const result = await dynamoDb.query(params).promise();
    return result.Items[0];
}

const getOne = middy.middy(getOneHandler);
getOne.use(middyLibs);
const getAll = middy.middy(getAllHandler);
getAll.use(middyLibs);

module.exports = {
    getAll,
    getOne,
    getEvent
}
