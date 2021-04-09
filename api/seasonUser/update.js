const TABLE_NAME = process.env.CONFIG_USER_TABLE;

const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.HASH_KEY_USER;

const util = require('../util.js');
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const updateMsSchema = require('../../lib/json-schema/seasonUser/updateSeasonUser');
const get = require('./get');
/**
 *
 * @param event
 * @returns {Promise<{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: (*|number)}|{headers: {"Access-Control-Allow-Origin": string}, body: string, statusCode: number}|{headers: {"Access-Control-Allow-Origin": string}, statusCode: number}>}
 */
const updateHandler = async (event) => {
    const {item} = event.body;

    try {
        let seasonUser = await get.getSeasonUser(item.PK, item.SK);
        if (!seasonUser) {
            console.warn("update error")
            return {
                statusCode: 404,
                body: JSON.stringify(`User with user name ${item.user_name}  does not  exists !`)
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
    expression.push([' SET user_name = :name, is_active= :active, position_role= :position']);
    expression.push([' fees_paid = :paid']);
    return expression.toString();
}

function getValues(item) {
    return {
        ":name": item.user_name,
        ":active": item.is_active,
        ":position": item.position_role,
        ":paid": item.fees_paid
    };
}
module.exports.handler = middy
    .middy(updateHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: updateMsSchema.schema}));

