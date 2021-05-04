'use strict';

const util = require('../util.js');
const createError = require('http-errors');


const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_EVENT;
const SORT_KEY = process.env.SORT_KEY_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];

/**
 * Retrieve an event for a distinct search Term
 * Route: GET /event/search{searchTerm}
 */
const searchHandler = async (event) => {
    let myEvents = [];

    const {searchTerm} = event.pathParameters;
    util.validate(searchTerm);

    try {
        myEvents = await searchEvent(searchTerm);
    } catch (e) {
        throw new createError.InternalServerError(e)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(myEvents)
    };
}


/**
 * Retrieve an event for a distinct search term
 */
const searchEvent = async (searchTerm) => {

    return await dynamoDb.search(TABLE_NAME, HASH_KEY, SORT_KEY, searchTerm);

}


module.exports.handler = middy.middy(searchHandler).use(middyLibs);
