const util = require('../util.js');
const get = require('./get')

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_EVENT;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);

/**
 * Create new event
 * Route: POST /event/
 */

exports.handler = async (event) => {

    const item = JSON.parse(event.body);
    console.log("create event.... started", item);

    try {
        validate(item);
        const start_date = item.starting_date;
        const i=start_date.indexOf('-');;
        const eventYear= start_date.slice(0,i);
        const eventName= item.event_name;

        const theEvent = await get.getEvent(eventYear, eventName);
        if (theEvent && (theEvent.event_name === eventName)) {
            return {
                statusCode:  409 ,
                headers: util.getResponseHeaders(),
                body: JSON.stringify({
                    message:`Event with name ${eventName} for year ${eventYear} already exists.`
                })
            };
        }

        item.PK = HASH_KEY_PREFIX + item.year;
        item.SK = SORT_KEY_PREFIX + item.name;
        delete item.year;

        console.log("PK:", item.PK);
        console.log("SK:", item.SK);
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

function validate(item) {

    util.validateItem(item, 'event_name');
    util.validateItem(item, 'event_status');
    util.validateItem(item, 'meeting_point');
    util.validateItem(item, 'starting_date');
    util.validateItem(item, 'ending_date');
}
