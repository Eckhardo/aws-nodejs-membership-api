const util = require('../util.js');
const get = require('./get')
const createEventSchema = require('../../lib/json-schema/event/createEvent');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const HASH_KEY = process.env.HASH_KEY_EVENT;
const SORT_KEY = process.env.SORT_KEY_EVENT;
const dynamoDb = require('../Dynamo');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler()];
const createError = require('http-errors');
/**
 * Create new event
 * Route: POST /event/
 */

const createHandler = async (event) => {

    const {item} = event.body;
    const SK = SORT_KEY + item.event_short;

    try {
        const theEvent = await get.getEvent(SK);
        if (theEvent) {
            throw new createError.NotAcceptable(`Event with short name ${item.event_short}  already exists.`);

        }

        item.PK = HASH_KEY;
        item.SK = SORT_KEY + item.event_short;
        const params = {
            TableName: TABLE_NAME,
            Item: item
        };

        await dynamoDb.write(TABLE_NAME, item);

    } catch (err) {
        throw new createError.InternalServerError(JSON.stringify(err));
    }
    return {
        statusCode: 201
    }
}


module.exports.handler = middy.middy(createHandler).use(middyLibs).use(middy.validator({inputSchema: createEventSchema.schema}));
