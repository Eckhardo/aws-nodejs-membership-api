'use strict';

const util = require('../util.js');
const createError = require('http-errors');
const databaseManager = require('../dynamoDbConnect');

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY= process.env.HASH_KEY_EVENT;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];

/**
 * GET all events for a distinct year
 * Route: GET /event/{year}
 */
const getAllHandler = async () => {
    let events;
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk ',
        ExpressionAttributeValues: {':pk':HASH_KEY },
    }

    try {
        events = await dynamoDb.query(params).promise();
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return util.makeAllResponse(events);
}


/**
 * Retrieve an event for a distinct year and name
 * Route: GET /event/{year}/{name}
 */
const getOneHandler = async (event) => {
    let myEvent;

    const {name} = event.pathParameters;

    util.validate(name);

    try {
        myEvent = await getEvent(name);

    } catch (e) {
        throw new createError.InternalServerError(e)
    }
    if (!myEvent) {
        throw new createError.NotFound(`Event with user name ${name}  for ${year} does not exist !`)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(myEvent)
    };
}


/**
 * Retrieve an event for a distinct name
 */
const getEvent = async ( name) => {

    util.validate(name);

    const pk = HASH_KEY;
    const sk = SORT_KEY_PREFIX  + name;

    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: ':pk = PK and :sk = SK',
        ExpressionAttributeValues: {':pk': pk, ':sk': sk},
        Limit: 1
    }
    const result = await dynamoDb.query(params).promise();
    return  result ? result.Items[0] : null;
}

const getOne = middy.middy(getOneHandler).use(middyLibs);
const getAll = middy.middy(getAllHandler).use(middyLibs);

module.exports = {
    getAll,
    getOne,
    getEvent
}
