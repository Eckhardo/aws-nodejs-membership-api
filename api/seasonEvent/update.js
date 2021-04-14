const TABLE_NAME = process.env.CONFIG_USER_TABLE;

const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.SORT_KEY_EVENT;
const util = require('../util.js');
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const updateMsSchema = require('../../lib/json-schema/seasonEvent/updateSeasonEvent');
const get = require('./get');
/**
 *
 * @param event
 * @returns {Promise<{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: (*|number)}|{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: number}|{headers: {"Access-Control-Allow-Origin": string}, statusCode: number}>}
 */
const updateHandler = async (event) => {


    const {item} = event.body;
    console.log("ITEM update:", JSON.stringify(item));

    try {
        let seasonEvent = await get.getSeasonEvent(item.PK, item.SK);
        if (!seasonEvent) {
            console.log("update error")
            return {
                statusCode: 404,
                body: JSON.stringify(`Event with event name ${item.event_name}  does not  exists !`)
            };
        }
        await dynamoDb.update(TABLE_NAME, item.PK, item.SK, getKeys(), getValues(item));
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200
    }
}


function getKeys() {
    let expression = [];
    expression.push([' SET event_name = :name, finished = :finished, meeting_point = :point']);
    expression.push([' comments = :comments', 'starting_date = :start', 'ending_date = :end']);
    return expression.toString();
}

function getValues(item) {
    return {
        ":name": item.event_name,
        ":finished": item.finished,
        ":point": item.meeting_point,
        ":start": item.starting_date,
        ":end": item.ending_date,
        ":comments": item.comments

    };
}

module.exports.handler = middy
    .middy(updateHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: updateMsSchema.schema}));

