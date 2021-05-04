const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../Dynamo')
const HASH_KEY = process.env.HASH_KEY_SEASON;
const SORT_KEY = process.env.HASH_KEY_USER;


const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const get = require('./get');

const deleteHandler = async (event) => {
    const {year,name} = event.pathParameters;
    const pk = HASH_KEY + year;
    const sk= SORT_KEY + name;
    try {
        let userEvent = await get.getSeasonUser(pk, sk);
        if (!userEvent) {
            console.error("update error")
            return {
                statusCode: 404,
                body: JSON.stringify(`User with user name ${name}  does not  exists !`)
            };
        }
        await dynamoDb.remove(TABLE_NAME,pk, sk);

    } catch (err) {
        throw  new createError.InternalServerError(err);
    }
    return {
        statusCode: 200
    };
}

module.exports.handler = middy.middy(deleteHandler).use(middyLibs);

