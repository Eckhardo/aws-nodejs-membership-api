'use strict';
const createError = require('http-errors');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.HASH_KEY_EVENT;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];



const getAll=  async ( event) =>{
    let compEvents;
    const {season_year} = event.pathParameters;


    try {
        compEvents = await dynamoDb.search(TABLE_NAME, HASH_KEY+season_year, SORT_KEY,"");
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(compEvents)
    }
}


const getOne =  async (event) =>{
    let compEvent;
    const {season_year, event_name} = event.pathParameters;

    try{
     compEvent = await dynamoDb.getByKeys(TABLE_NAME, HASH_KEY +season_year, SORT_KEY+ event_name);
        console.log("CompUser",JSON.stringify(compEvent));
    }
    catch (err){
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(compEvent)
    }


}
const getOneHandler = middy.middy(getOne).use(middyLibs);
const getAllHandler = middy.middy(getAll).use(middyLibs);

module.exports = {
    getOneHandler,
    getAllHandler
}
