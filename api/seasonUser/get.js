'use strict';

const createError = require('http-errors');


const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.HASH_KEY_USER;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];



const getAll=  async ( event) =>{
    let compUsers;
    const {season_year} = event.pathParameters;


    try {
        compUsers = await dynamoDb.search(TABLE_NAME, HASH_KEY+season_year, SORT_KEY,"");
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(compUsers)
    }
}


const getOne =  async (event) =>{
    let compUser;
    const {season_year, user_name} = event.pathParameters;

    try{
     compUser = await dynamoDb.getByKeys(TABLE_NAME, HASH_KEY +season_year, SORT_KEY+ user_name);
        console.log("CompUser",JSON.stringify(compUser));
    }
    catch (err){
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(compUser)
    }


}
const getOneHandler = middy.middy(getOne).use(middyLibs);
const getAllHandler = middy.middy(getAll).use(middyLibs);

module.exports = {
    getOneHandler,
    getAllHandler
}
