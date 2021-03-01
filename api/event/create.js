const util = require('../util.js');
const get = require('./get')
const createEventSchema = require('../../lib/json-schema/event/createEvent');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const HASH_KEY= process.env.HASH_KEY_EVENT;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_EVENT;const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler()];
const createError = require('http-errors');
/**
 * Create new event
 * Route: POST /event/
 */

const createHandler = async (event) => {

    const {item} = event.body;
    const start_date = item.starting_date;
    const eventYear = start_date.slice(0, start_date.indexOf('-'));
    const eventName = item.event_name;

    try {
         const theEvent = await get.getEvent(eventYear, eventName);
        if (theEvent && (theEvent.event_name === eventName)) {
            return {
                statusCode: 409,
                headers: util.getResponseHeaders(),
                body: JSON.stringify({
                    message: `Event with name ${eventName} for year ${eventYear} already exists.`
                })
            };
        }

        item.PK = HASH_KEY ;
        item.SK = SORT_KEY_PREFIX + eventName;
         const params = {
            TableName: TABLE_NAME,
            Item: item
        };

        await dynamoDb.put(params).promise();

    } catch (err) {
        throw new createError.InternalServerError(err)
    }
    return {
        statusCode: 201
    }
}


module.exports.handler = middy.middy(createHandler).use(middyLibs).use(middy.validator({inputSchema: createEventSchema.schema}));
