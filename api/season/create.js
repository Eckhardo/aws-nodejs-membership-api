

const dynamoDb = require('../Dynamo');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const SORT_KEY = process.env.SORT_KEY_SEASON;
const HASH_KEY = process.env.HASH_KEY_SEASON;
const util = require('../util.js');
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createMsSchema = require('../../lib/json-schema/season/createSeason');
/**
 * Create new season
 *
 * Route: POST /season/
 */


const createHandler = async (event) => {
    const {item} = event.body;
    const year = item.season_year;
    util.validate(year);
    item.PK = HASH_KEY + year;
    item.SK = SORT_KEY;

    const params = {
        TableName: TABLE_NAME,
        Item: item
    };
    console.log("params delete:", params);

    console.log("create.... item: ", item);

    try {
        let data = await dynamoDb.write(TABLE_NAME,item);

    } catch (err) {
        throw new createError.InternalServerError(err);

    }
    return {
        statusCode: 201
    }


}
module.exports.handler = middy
    .middy(createHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: createMsSchema.schema}));
