'use strict';
const createError = require('http-errors');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');

const SORT_KEY = process.env.HASH_KEY_USER;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];


const getAll = async (event) => {
    let userEvents;
    const {year, event_name} =event.pathParameters;
    console.log(" event get all::", event_name);
    console.log("year get all::", year);

    try{
         userEvents= await getUserEvents(year,event_name);
     }
     catch (e) {
         throw new createError.InternalServerError(err);

     }
    return {
        statusCode: 200,
        body: JSON.stringify(userEvents)
    }
}

const getUserEvents = (year,event_name) => {
    return dynamoDb.search(TABLE_NAME, year + event_name, SORT_KEY, "");
}

const getOne = async (event) => {
    let userEvent;
    const {year,user_name, event_name} = event.pathParameters;
    console.log("year delete::", year);
    console.log("user event get::", event_name);
    console.log("user event get::", user_name);

    try {
        userEvent = await getUserEvent(year,event_name, user_name);
        console.log("user event", JSON.stringify(userEvent));
    } catch (err) {
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(userEvent)
    }
}


const getUserEvent = async(year, event_name, user_name) => {
    return await dynamoDb.getByKeys(TABLE_NAME, year + event_name, SORT_KEY + user_name);
}
const getOneHandler = middy.middy(getOne).use(middyLibs);
const getAllHandler = middy.middy(getAll).use(middyLibs);

module.exports = {
    getOneHandler,
    getAllHandler,
    getUserEvent,
    getUserEvents
}
