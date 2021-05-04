'use strict';
const createError = require('http-errors');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.SORT_KEY_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];


const getAll = async (event) => {
    let seasonEvents;
    const {year} = event.pathParameters;

    try {
        seasonEvents = await getSeasonEvents(year);
        console.log("seasonEvents::", JSON.stringify(seasonEvents));
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(seasonEvents)
    }
}

 const getSeasonEvents = (year) => {
    return   dynamoDb.search(TABLE_NAME, HASH_KEY + year, SORT_KEY, "");
 }
const getOne = async (event) => {
    let seasonEvent;
    const {year, name} = event.pathParameters;

    try {
        seasonEvent = await getSeasonEvent(HASH_KEY + year, SORT_KEY + name);
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(seasonEvent)
    }


}


const getSeasonEvent = async (PK, SK) => {
    return await dynamoDb.getByKeys(TABLE_NAME, PK, SK);
}
const getOneHandler = middy.middy(getOne).use(middyLibs);
const getAllHandler = middy.middy(getAll).use(middyLibs);

module.exports = {
    getOneHandler,
    getAllHandler,
    getSeasonEvent,
    getSeasonEvents
}
