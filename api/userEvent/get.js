'use strict';
const createError = require('http-errors');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const USER_EVENT_INDEX = process.env.INDEX_KEY_USER_EVENT;
const SORT_KEY = process.env.HASH_KEY_USER;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];
const _ = require('underscore');

const getAllEventsForSeason = async (event) => {
    const {year} = event.pathParameters;
    console.log("getAllEventsForSeason::");

    let events = [];
    try {
        let userEvents = await dynamoDb.queryByIndexWithProjection(TABLE_NAME, USER_EVENT_INDEX, 'season_year =:year', {':year': parseInt(year)}, 'event_name');
        if (userEvents && userEvents.length > 0) {
            events = _.uniq(userEvents, x => x.event_name);
            events.forEach((x, index) => {
                if (_.isEmpty(x)) {
                    events.splice(index, 1);
                }
            });
        }
        console.log("EVENTS::", JSON.stringify(events));
    } catch (err) {
        throw new createError.InternalServerError(err);

    }
    return {
        statusCode: 200,
        body: JSON.stringify(events)
    }

}


const getAllUsersForSeason = async (event) => {
    const {year} = event.pathParameters;

    let users = [];
    try {
        let userEvents = await dynamoDb.queryByIndexWithProjection(TABLE_NAME, USER_EVENT_INDEX, 'season_year =:year', {':year': parseInt(year)}, 'user_name');
        if (userEvents && userEvents.length > 0) {
            users = _.uniq(userEvents, x => x.user_name);
            users.forEach((x, index) => {
                if (_.isEmpty(x)) {
                    users.splice(index, 1);
                }
            });
        }

        console.log("USERS::", JSON.stringify(users));
    } catch (err) {
        throw new createError.InternalServerError(err);

    }
    return {
        statusCode: 200,
        body: JSON.stringify(users)
    }

}


const getAll = async (event) => {
    let userEvents;
    const {year, event_name} = event.pathParameters;

    try {
        userEvents = await getUserEvents(year, event_name);
    } catch (e) {
        throw new createError.InternalServerError(err);

    }
    return {
        statusCode: 200,
        body: JSON.stringify(userEvents)
    }
}

const getUserEvents = (year, event_name) => {
    return dynamoDb.search(TABLE_NAME, year + event_name, SORT_KEY, "");
}

const getOne = async (event) => {
    let userEvent;
    const {year, user_name, event_name} = event.pathParameters;

    try {
        userEvent = await getUserEvent(year, event_name, user_name);
    } catch (err) {
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(userEvent)
    }
}


const getUserEvent = async (year, event_name, user_name) => {
    return await dynamoDb.getByKeys(TABLE_NAME, year + event_name, SORT_KEY + user_name);
}
const getOneHandler = middy.middy(getOne).use(middyLibs);
const getAllHandler = middy.middy(getAll).use(middyLibs);
const getEventsHandler = middy.middy(getAllEventsForSeason).use(middyLibs);
const getUsersHandler = middy.middy(getAllUsersForSeason).use(middyLibs);
module.exports = {
    getOneHandler,
    getAllHandler,
    getEventsHandler,
    getUsersHandler,
    getUserEvent,
    getUserEvents
}
