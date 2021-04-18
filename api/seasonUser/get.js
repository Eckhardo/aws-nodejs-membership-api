'use strict';

const createError = require('http-errors');


const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo');
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.HASH_KEY_USER;
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler()];


const getAll = async (event) => {
    let compUsers;
    const {year} = event.pathParameters;
    console.log("Season year", year);

    try {
        compUsers = await getSeasonUsers(year);
    } catch
        (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(compUsers)
    }
}

const getSeasonUsers = (year) => {
    return dynamoDb.search(TABLE_NAME, HASH_KEY + year, SORT_KEY, "");

}
const getOne = async (event) => {
    let compUser;
    const {year, name} = event.pathParameters;

    try {
        compUser = await getSeasonUser(HASH_KEY + year, SORT_KEY + name);
    } catch (err) {
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(compUser)
    }

}
const getSeasonUser = async (PK, SK) => {
    return await dynamoDb.getByKeys(TABLE_NAME, PK, SK);
}
const getOneHandler = middy.middy(getOne).use(middyLibs);
const getAllHandler = middy.middy(getAll).use(middyLibs);


module.exports = {
    getOneHandler,
    getAllHandler,
    getSeasonUser,
    getSeasonUsers
}
