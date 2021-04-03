const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;

const dynamoDb = require('../Dynamo');
const SORT_KEY = process.env.SORT_KEY_SEASON;
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SEASON_INDEX = process.env.INDEX_KEY_SEASON;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createError = require('http-errors');
const getAllHandler = async () => {
    let seasons;
      console.log("SEASONS.getALL::")

    try {
        seasons = await dynamoDb.queryByIndex(TABLE_NAME, SEASON_INDEX, 'SK =:SK', {':SK': 'SEASON'});

    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(seasons)
    }
}

const getAllWithChildrenHandler = async (event) => {
    let seasons;
    const {year} = event.pathParameters;

    console.log("withChildren::", year);


    try {
        seasons = await dynamoDb.getAllWithProjections(TABLE_NAME,  HASH_KEY+ year, "PK, SK, season_name, season_year, event_name, user_name");
           console.log("WithChildren::", JSON.stringify(seasons));
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(seasons)
    }
}


/**
 *
 * @param event
 * @returns {Promise<{body: string, statusCode: number}>}
 */
const getOneHandler = async (event) => {
    let mySeason;
    const {year} = event.pathParameters;
    util.validate(year);

    try {
        mySeason = await dynamoDb.getByKeys(TABLE_NAME, HASH_KEY + year, SORT_KEY);
    } catch (e) {
        throw new createError.InternalServerError(e)
    }
    if (!mySeason) {
        throw new createError.NotFound(`Season for year "${year}" does not exist !`)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(mySeason)
    };


}

const getOne = middy.middy(getOneHandler).use(middyLibs);
const getAll = middy.middy(getAllHandler).use(middyLibs);
const getAllWithChildren= middy.middy(getAllWithChildrenHandler).use(middyLibs);
module.exports = {
    getAll,
    getAllWithChildren,
    getOne
}
