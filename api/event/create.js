const util = require('../util.js');
const get = require('./get')
const createEventSchema = require('../../lib/json-schema/event/createEvent');
const TABLE_NAME = process.env.CONFIG_USER_TABLE_OFFLINE;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_EVENT;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler()];

/**
 * Create new event
 * Route: POST /event/
 */

const createHandler = async (event) => {

    const {item} = event.body;
    console.log("create event.... started", item);

    try {
        const start_date = item.starting_date;
        const i = start_date.indexOf('-');

        const eventYear = start_date.slice(0, i);
        const eventName = item.event_name;
        console.log("eventYear:", eventYear);
        console.log("eventName:", eventName);
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

        item.PK = HASH_KEY_PREFIX + eventYear;
        item.SK = SORT_KEY_PREFIX + eventName;
        console.log("item.PK:", item.PK);
        console.log("item.SK:", item.SK);
        const params = {
            TableName: TABLE_NAME,
            Item: item
        };

        let data = await dynamoDb.put(params).promise();
        console.log("....created item:: ", data);
        return util.make201Response(item);
    } catch (err) {
        util.makeErrorResponse(err);
    }
}


const handler = middy.middy(createHandler);
handler.use(middyLibs).use(middy.validator({inputSchema: createEventSchema.schema}));

module.exports = {
    handler
}
