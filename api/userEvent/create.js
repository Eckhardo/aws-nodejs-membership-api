'use strict';
const util = require('../util.js');
const dynamoDb = require('../Dynamo');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;

const SORT_KEY = process.env.HASH_KEY_USER;

const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createSchema = require('../../lib/json-schema/userEvent/createUserEvent');
const createError = require('http-errors');
const get = require('./get');

const uuid = require('uuid');
/**
 * Create new season event
 *
 * Route: POST /season/
 */


const createHandler = async (event) => {
    const {item} = event.body;
    const year = item.season_year;
    const event_name = item.event_name;
    const user_name = item.user_name;
    item.PK = year +  event_name;
    item.SK = SORT_KEY + user_name;

    console.log("user event create::", JSON.stringify(item));
    try {
        let userEvent = await get.getUserEvent(year,event_name, user_name);
        if (userEvent) {
            console.log("create error")
            return {
                statusCode: 404,
                body: JSON.stringify(`User Event with user name ${item.user_name} and event name ${item.event_name}  already exists !`)
            };
        }
        await dynamoDb.write(TABLE_NAME, item);
    } catch (err) {
        throw new createError.BadRequest;
    }
    return {
        statusCode: 201
    }
}
module.exports.handler = middy
    .middy(createHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: createSchema.schema}));
