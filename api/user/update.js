const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const PK = process.env.HASH_KEY_USER;
const SK_Prefix = process.env.SORT_KEY_USER;

const dynamoDb = require('../Dynamo');
const get = require('./get')
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(), middy.httpCors()];
const updateUserSchema = require('./../../lib/json-schema/user/updateUser');


/**
 * Update a user
 *
 * User name is first validated against the db to make sure that this user exists.
 *
 * Route: PUT /user/
 */

const updateHandler = async (event) => {

    let {item} = event.body;

    try {
        let user = await get.getUser(item.user_name);
        if (!user) {
            return {
                statusCode: 204,
                body: JSON.stringify(`User with user name ${item.user_name}  does not exist !`)
            };
        }
        console.log("Item:", JSON.stringify(item));
        await dynamoDb.update(TABLE_NAME, PK + item.user_name, SK_Prefix, getExpression(), getValues(item));

    } catch (err) {
        console.error('Error:', err);
        throw new createError.InternalServerError(err);
    }
    console.error('Return OK:');
    return {
        statusCode: 200
    }
}

const getExpression = () => {
    let expression = [];
    expression.push([' SET first_name = :fname', ' last_name= :lname']);
    expression.push([' city = :city', ' zip = :zip', ' address = :address']);
    expression.push([' email = :email', ' phone = :phone', ' mobil = :mobil']);
    expression.push([' admission_year = :admission_year'])
    return expression.toString();
}

const getValues = (user) => {
    return {
        ":fname": user.first_name,
        ":lname": user.last_name,
        ":city": user.city,
        ":zip": user.zip,
        ":address": user.address,
        ":email": user.email,
        ":phone": user.phone,
        ":mobil": user.mobil,
        ":admission_year": user.admission_year

    };
}

module.exports.handler = middy.middy(updateHandler)
    .use(middyLibs)
    .use(middy.validator({inputSchema: updateUserSchema.schema}));
