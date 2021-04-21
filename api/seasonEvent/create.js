'use strict';
const util = require('../util.js');
const dynamoDb = require('../Dynamo');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.SORT_KEY_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createSchema = require('../../lib/json-schema/seasonEvent/createSeasonEvent');
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
    const name = item.event_name;
    item.PK = HASH_KEY + year;
    item.SK = SORT_KEY + name;

    try {
        let seasonEvent = await get.getSeasonEvent(item.PK, item.SK);
        if (seasonEvent) {
            return {
                statusCode: 404,
                body: JSON.stringify(`Event with event name ${item.event_name}  already exists !`)
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
