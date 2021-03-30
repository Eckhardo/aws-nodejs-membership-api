const TABLE_NAME = process.env.CONFIG_USER_TABLE;

const dynamoDb = require('../Dynamo');
const SORT_KEY = process.env.SORT_KEY_SEASON;
const HASH_KEY = process.env.HASH_KEY_SEASON;
const util = require('../util.js');
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const updateMsSchema = require('../../lib/json-schema/season/updateSeason');

/**
 *
 * @param event
 * @returns {Promise<{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: (*|number)}|{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: number}|{headers: {"Access-Control-Allow-Origin": string}, statusCode: number}>}
 */
const updateHandler = async (event) => {



    const {item} = event.body;
    const year = item.season_year;
    util.validate(year);
    console.log("season::", JSON.stringify(item));

    try {
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
    expression.push([' SET season_name = :name, is_active= :active, season_year= :year']);
    expression.push([' members = :members, events= :events']);
    return expression.toString();
}

function getValues(item) {
    return {
        ":name": item.season_name,
        ":active": item.is_active,
        ":year": item.season_year,
        ":members": item.members,
        ":events": item.events
    };
}
module.exports.handler = middy
    .middy(updateHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: updateMsSchema.schema}));

