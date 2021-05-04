'use strict';


const TABLE_NAME = process.env.CONFIG_USER_TABLE_OFFLINE;
const USER_INDEX = process.env.INDEX_KEY_USER;
const dynamoDb = require('../Dynamo');
const util = require('../util');
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];

/**
 * GET all users by GSI
 *
 * Route: GET /user/
 */
const getAllHandler = async () => {
    let users;
    console.log("get All users for index::", USER_INDEX);

    try {
           users= await getUsers();
    } catch (err) {
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(users)
    }
}
const getUsers =async () =>{
   return await dynamoDb.queryByIndex(TABLE_NAME, USER_INDEX, 'SK =:SK', {':SK': 'USER'});

}

const handler  = middy.middy(getAllHandler).use(middyLibs);

module.exports = {
    handler,
    getUsers
}
