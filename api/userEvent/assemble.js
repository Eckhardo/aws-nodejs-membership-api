'use strict';
const util = require('../util.js');
const dynamoDb = require('../Dynamo');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const SORT_KEY = process.env.HASH_KEY_USER;
const middy = require('../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createError = require('http-errors');
const getUser = require('../user/getAll');
const getEvent = require('../event/get');
const get = require('./get');


const assembleUserHandler = async (event) => {
    const {year, user_name} = event.pathParameters;
    console.log("year::", year);
    console.log("user::", user_name);
    let newUserEvents = [];
    try {
        const events = await getEvent.getEvents();
        events.forEach((myEvent, index) => {
            let event_name = myEvent.event_name;
            newUserEvents[index] = createObject(year, event_name, user_name);
        })
        await checkIfExists(newUserEvents);
        await dynamoDb.batchWrite(TABLE_NAME, newUserEvents);
    } catch (err) {
        console.error("ERROR::", err);
        throw new createError.BadRequest;
    }
    return {
        statusCode: 201
    }
}

const assembleEventHandler = async (event) => {
    const {year, event_name} = event.pathParameters;
    console.log("year::", year);
    console.log("event::", event_name);
    let userEvents = [];
    try {
        const users = await getUser.getUsers();
        users.forEach((myUser, index) => {
            let user_name = myUser.user_name;
            userEvents[index] = createObject(year, event_name, user_name);
        })
        await checkIfExists(userEvents);
        await dynamoDb.batchWrite(TABLE_NAME, userEvents);
    } catch (err) {
        console.error("ERROR::", err);
        throw new createError.BadRequest;
    }
    return {
        statusCode: 201
    }
}


async function checkIfExists(userEvents){

    for (let i = 0; i < userEvents.length; i++) {
        let userEvent = await
            get.getUserEvent(userEvents[i].season_year, userEvents[i].event_name, userEvents[i].user_name);
        if (userEvent) {
            console.log('slice', JSON.stringify(userEvents[i]));
            userEvents.splice(i, 1);
        }
    }
    console.log('Done!', userEvents.length);
}

function createObject(year, event_name, user_name) {
    return {
        PK: year + event_name,
        SK: SORT_KEY + user_name,
        season_year: parseInt(year),
        user_name: user_name,
        event_name: event_name,
        registered: false,
        took_part: false
    };
}




const userHandler = middy.middy(assembleUserHandler).use(middyLibs);
const eventHandler = middy.middy(assembleEventHandler).use(middyLibs);

module.exports =
    {
        userHandler,
        eventHandler
    }
