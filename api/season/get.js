const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;

const dynamoDb = require('../Dynamo');
const SORT_KEY = process.env.SORT_KEY_SEASON;
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SEASON_INDEX = process.env.INDEX_KEY_SEASON;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const createError = require('http-errors');
const seasonUser = require('../seasonUser/get');
const seasonEvent = require('../seasonEvent/get');
const getAllHandler = async () => {
    let seasons = [];

    try {
        let mySeasons = await dynamoDb.queryByIndex(TABLE_NAME, SEASON_INDEX, 'SK =:SK', {':SK': 'SEASON'});
        if (mySeasons) {
            for (let i = 0; i < mySeasons.length; i++) {
                seasons[i] = await getWithMembersAndEvents(mySeasons[i].season_year);
            }
        }
    } catch (err) {
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(seasons)
    }
}

const getWithChildrenHandler = async (event) => {
    let season;
    const {year} = event.pathParameters;

    try {
        season = await getWithMembersAndEvents(year);
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(season)
    }
}

const getWithMembersAndEvents = async (year) => {
    let season = await getSeason(year);
    let seasonUsers = await seasonUser.getSeasonUsers(year);
    season.members = seasonUsers.map(su => su.user_name);
    let seasonEvents = await seasonEvent.getSeasonEvents(year);
    season.events = seasonEvents.map(su => su.event_name);
    return season;
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
        mySeason = await getSeason(year);
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

const getSeason = async (year) => {

    return await dynamoDb.getByKeys(TABLE_NAME, HASH_KEY + year, SORT_KEY);

}

const getOne = middy.middy(getOneHandler).use(middyLibs);
const getAll = middy.middy(getAllHandler).use(middyLibs);
const getWithChildren = middy.middy(getWithChildrenHandler).use(middyLibs);
module.exports = {
    getAll,
    getWithChildren,
    getOne
}
