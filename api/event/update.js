const util = require('../util.js');
const get = require('./get')

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY= process.env.HASH_KEY_EVENT;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_EVENT;const databaseManager = require('../dynamoDbConnect');

const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler()];
const updateEventSchema = require('../../lib/json-schema/event/updateEvent');
const createError = require('http-errors');

const updateHandler = async (event) => {

    const {item} = event.body;

    try {

        const eventName = item.event_short;
        console.log("vorher", eventName);
        const theEvent = await get.getEvent( eventName);
        console.log("nachher", JSON.stringify(theEvent));
        if (!theEvent || (theEvent.event_short !== eventName)) {
            return {
                statusCode: 409,
                headers: util.getResponseHeaders(),
                body: JSON.stringify({
                    message: `Event with name ${eventName}  does not  exist.`
                })
            };
        }


      await dynamoDb.update(TABLE_NAME,item.PK, item.SK, getKeys(),getValues(item));

    } catch (err) {
        console.error("Error in Update", err);
         throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200
    }
}


function getKeys() {
    let expression = [];
    expression.push([' SET event_short = :event_short', ' event_name= :event_name']);
    expression.push([' starting_date = :starting_date', ' ending_date = :ending_date', ' meeting_point = :meeting_point']);
    expression.push([' comments = :comments']);
    return expression.toString();
}

function getValues(theEvent) {
    return {
        ":event_short": theEvent.event_short,
        ":event_name": theEvent.event_name,
        ":starting_date": theEvent.starting_date,
        ":ending_date": theEvent.ending_date,
        ":meeting_point": theEvent.meeting_point,
        ":comments": theEvent.comments
    };
}


const handler = middy.middy(updateHandler);
handler.use(middyLibs).use(middy.validator({inputSchema: updateEventSchema.schema}));

module.exports = {
    handler
}

