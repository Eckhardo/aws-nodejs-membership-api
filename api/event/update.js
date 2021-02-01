const util = require('../util.js');
const get = require('./get')
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler()];
const updateEventSchema = require('../../lib/json-schema/event/updateEvent');
const createError = require('http-errors');

const updateHandler = async (event) => {

    const {item} = event.body;
    const start_date = item.starting_date;
    const i = start_date.indexOf('-');
    const eventYear = start_date.slice(0, i);

    try {

        const eventName = item.event_name;
        const theEvent = await get.getEvent(eventYear, eventName);
        if (!theEvent || (theEvent.event_name !== eventName)) {
            return {
                statusCode: 409,
                headers: util.getResponseHeaders(),
                body: JSON.stringify({
                    message: `Event with name ${eventName} for year ${eventYear} already exists.`
                })
            };
        }

        const params = {
            TableName: TABLE_NAME,
            Key: {PK: HASH_KEY_PREFIX + eventYear, SK: SORT_KEY_PREFIX + eventName},
            UpdateExpression: getUpdateExpression(),
            ExpressionAttributeValues: getUpdateExpressionValues(item),
            ReturnValues: "NONE"
        };

      await dynamoDb.update(params).promise();

    } catch (err) {
         throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200
    }
}


function getUpdateExpression() {
    let expression = [];
    expression.push([' SET event_status = :event_status', ' event_name= :event_name']);
    expression.push([' starting_date = :starting_date', ' ending_date = :ending_date', ' meeting_point = :meeting_point']);
    expression.push([' comments = :comments']);
    return expression.toString();
}

function getUpdateExpressionValues(theEvent) {
    return {
        ":event_status": theEvent.event_status,
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

