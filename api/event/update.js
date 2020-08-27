const util = require('../util.js');
const get = require('./get')
const databaseManager = require('../dynamoDbConnect');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_MEMBERSHIP;
const SORT_KEY_PREFIX = process.env.SORT_KEY_PREFIX_MEMBERSHIP_EVENT;


exports.handler = async (event) => {

    const item = JSON.parse(event.body);
    console.log("update event.... started", item);

    try {
        validate(item);
        const start_date = item.starting_date;
        const i=start_date.indexOf('-');;
        const eventYear= start_date.slice(0,i);

        const eventName = item.event_name;
        const theEvent = await get.getEvent(eventYear, eventName);
        if (! theEvent || (theEvent.event_name !== eventName)) {
            return {
                statusCode: 409,
                headers: util.getResponseHeaders(),
                body: JSON.stringify({
                    message: `Event with name ${eventName} for year ${eventYear} already exists.`
                })
            };
        }
        const pk = HASH_KEY_PREFIX + eventYear;
        const sk = SORT_KEY_PREFIX + eventName;

        const params = {
            TableName: TABLE_NAME,
            Key: {PK: pk, SK: sk},
            UpdateExpression: getUpdateExpression(),
            ExpressionAttributeValues: getUpdateExpressionValues(item),
            ReturnValues: "UPDATED_NEW"
        };

        let data = await dynamoDb.update(params).promise();
        return util.makeSingleResponseAttributes(data.Attributes);
    } catch (err) {
        return util.makeErrorResponse(err);
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

function validate(item) {
    util.validateItem(item, 'event_name');
    util.validateItem(item, 'event_status');
    util.validateItem(item, 'meeting_point');
    util.validateItem(item, 'starting_date');
    util.validateItem(item, 'ending_date');
}

