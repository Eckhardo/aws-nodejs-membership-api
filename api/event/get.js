'use strict';

const util = require('../util.js');
const createError = require('http-errors');


const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_EVENT;
const SORT_KEY = process.env.SORT_KEY_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];

/**
 * GET all events for a distinct year
 * Route: GET /event/{year}
 */
const getAllHandler = async () => {
    let events;

    try {
        events = await dynamoDb.getAll(TABLE_NAME, HASH_KEY);
        console.log("events::", JSON.stringify(events));
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(events)
    }
}


/**
 * Retrieve an event for a distinct year and name
 * Route: GET /event/{SK}
 */
const getOneHandler = async (event) => {
    let myEvent;

    const {event_name} = event.pathParameters;
    util.validate(event_name);

    try {
        myEvent = await getEvent(SORT_KEY + event_name);

    } catch (e) {
        throw new createError.InternalServerError(e)
    }
    if (!myEvent) {
        throw new createError.NotFound(`Event with user name ${name}  does not exist !`)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(myEvent)
    };
}


/**
 * Retrieve an event for a distinct name
 */
const getEvent = async (SK) => {

    return await dynamoDb.getByKeys(TABLE_NAME, HASH_KEY, SK);

}

const getOne = middy.middy(getOneHandler).use(middyLibs);
const getAll = middy.middy(getAllHandler).use(middyLibs);

module.exports = {
    getAll,
    getOne,
    getEvent
}
