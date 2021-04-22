const TABLE_NAME = process.env.CONFIG_USER_TABLE;

const dynamoDb = require('../Dynamo');

const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const updateSchema = require('../../lib/json-schema/userEvent/updateUserEvent');
const get = require('./get');
/**
 *
 * @param event
 * @returns {Promise<{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: (*|number)}|{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: number}|{headers: {"Access-Control-Allow-Origin": string}, statusCode: number}>}
 */
const updateHandler = async (event) => {
    const {item} = event.body;

    try {
        let userEvent = await get.getUserEvent(item.season_year,item.event_name, item.user_name)
        if (!userEvent) {
            console.warn("update error")
            return {
                statusCode: 404,
                body: JSON.stringify(`UserEvent with user name ${item.user_name} for year ${item.season_year} does not  exists !`)
            };
        }

        await dynamoDb.update(TABLE_NAME, item.PK, item.SK,getKeys(),getValues(item) );
    } catch (err) {
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200
    }
}


function getKeys() {
    let expression = [];
    expression.push([' SET event_name = :ename, user_name = :uname, registered = :registered, took_part = :tookpart']);
    expression.push(['season_year = :year']);
    return expression.toString();
}

function getValues(item) {
    return {
        ":ename": item.event_name,
        ":uname": item.user_name,
        ":registered": item.registered,
        ":tookpart": item.took_part,
        ":year": item.season_year

    };
}

module.exports.handler = middy
    .middy(updateHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: updateSchema.schema}));

