'use strict';

const util = require('../util.js');
const createError = require('http-errors');


const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_EVENT;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];

/**
 * Retrieve an event for a distinct search Term
 * Route: GET /event/search{searchTerm}
 */
const searchHandler = async (event) => {
    let myEvents=[];

    const {searchTerm} = event.pathParameters;

    console.log("searchTerm::", searchTerm);

    util.validate(searchTerm);

    try {
        myEvents = await searchEvent(searchTerm);
        console.log("my events::", JSON.stringify(myEvents));
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

    const result = await dynamoDb.search(TABLE_NAME, HASH_KEY, SORT_KEY_PREFIX,searchTerm);
    return result;
}

const getAll = middy.middy(searchHandler).use(middyLibs);


module.exports = {

    getAll
}
