const util = require('../util.js');
const get = require('./get')

const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_EVENT;

const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler()];
const updateEventSchema = require('../../lib/json-schema/event/updateEvent');
const createError = require('http-errors');

const updateHandler = async (event) => {

    const {item} = event.body;
    const {SK}=item;

    try {
        const theEvent = await get.getEvent(SK);
        if (!theEvent || (theEvent.SK !== SK)) {
            throw new createError.NotAcceptable(`Event with SK ${SK}  does not exist.`);

        }
        await dynamoDb.update(TABLE_NAME, HASH_KEY, item.SK, getKeys(), getValues(item));

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
    expression.push([' SET event_short = :event_short', ' event_name= :event_name', 'comments= :comments']);
    return expression.toString();
}

function getValues(theEvent) {
    return {
        ":event_short": theEvent.event_short,
        ":event_name": theEvent.event_name,
        ":comments": theEvent.comments
   };
}


const handler = middy.middy(updateHandler);
handler.use(middyLibs).use(middy.validator({inputSchema: updateEventSchema.schema}));

module.exports = {
    handler
}

