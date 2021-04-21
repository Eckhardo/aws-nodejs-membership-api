'use strict';
const util = require('../util.js');
const dynamoDb = require('../Dynamo');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.HASH_KEY_USER;

const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createMsSchema = require('../../lib/json-schema/seasonUser/createSeasonUser');
const createError = require('http-errors');
const get = require('./get');
/**
 * Create new season
 *
 * Route: POST /season/
 */


const createHandler = async (event) => {
    const {item} = event.body;
    const year = item.season_year;
    const name = item.user_name;
    item.PK = HASH_KEY + year;
    item.SK = SORT_KEY + name;


    try {
        let seasonUser = await get.getSeasonUser(item.PK, item.SK);
        if (seasonUser) {
            return {
                statusCode: 404,
                body: JSON.stringify(`User with user name ${item.user_name}  already exists !`)
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
    .use(middy.validator({inputSchema: createMsSchema.schema}));
