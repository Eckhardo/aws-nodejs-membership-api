const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo')
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.HASH_KEY_USER;


const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];


const deleteHandler = async (event) => {
    console.log("event.pathParameters:", event.pathParameters);
    const {year} = event.pathParameters;
    const {name} = event.pathParameters;
     console.log("season year:", year);
    console.log("name:", name);
    const pk = HASH_KEY + year;
    const sk= SORT_KEY + name;
    try {
        await dynamoDb.remove(TABLE_NAME,pk, sk);

    } catch (err) {
        throw  new createError.InternalServerError(err);
    }
    return {
        statusCode: 200
    };
}

module.exports.handler = middy.middy(deleteHandler).use(middyLibs);

