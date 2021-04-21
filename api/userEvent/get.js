'use strict';
const createError = require('http-errors');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_USER;
const SORT_KEY = process.env.SORT_KEY_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];


const getAll = async (event) => {
 let userEvents;
    return {
        statusCode: 200,
        body: JSON.stringify(userEvents)
    }
}

 const getUserEvents = (year) => {
    return   dynamoDb.search(TABLE_NAME, HASH_KEY + year, SORT_KEY, "");
 }
const getOne = async (event) => {
    let userEvent;

    const {year, name} = event.pathParameters;

    try {
        userEvent = await getUserEvent(HASH_KEY + year, SORT_KEY + name);
        console.log("CompEvent", JSON.stringify(userEvent));
    } catch (err) {
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(userEvent)
    }


}


const getUserEvent = async (PK, SK) => {
    return await dynamoDb.getByKeys(TABLE_NAME, PK, SK);
}
const getOneHandler = middy.middy(getOne).use(middyLibs);
const getAllHandler = middy.middy(getAll).use(middyLibs);

module.exports = {
    getOneHandler,
    getAllHandler,
    getUserEvent,
    getUserEvents
}
