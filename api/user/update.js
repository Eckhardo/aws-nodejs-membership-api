const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const SORT_KEY_VALUE = process.env.SORT_KEY_USER_VALUE;
const get = require('./get')
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpEventNormalizer = require('@middy/http-event-normalizer'); //Normalizes HTTP events by adding an empty object for queryStringParameters
const httpErrorHandler = require('@middy/http-error-handler'); // handles common http errors and returns proper responses
const createErrors = require('http-errors');
const middlewares = [httpJsonBodyParser(), httpEventNormalizer(), httpErrorHandler()];


/**
 * Update a user
 *
 * User name is first validated against the db to make sure that this user exists.
 *
 * Route: PUT /user/
 */

const updateHandler = async (event) => {
    console.log("update  user.... started");
    const {item} = event.body;
    validate(item);
    try {
        //validate input against db
        let user = await get.getUser(item.user_name);
        if (!user) {
            throw  new createErrors(400, `User with user name ${userName}  does not exist !`);

        }
        const pk = HASH_KEY_PREFIX + item.user_name;
        const updateExpression = getUpdateExpression();
        const updateExpressionValues = getUpdateExpressionValues(item);

        console.log('updateExpressionValues: ', updateExpressionValues);
        const params = {

            TableName: TABLE_NAME,
            Key: {PK: pk, SK: SORT_KEY_VALUE},
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: updateExpressionValues,
            ReturnValues: "UPDATED_NEW"

        };
        let data = await dynamoDb.update(params).promise();
        return util.makeSingleResponseAttributes(data.Attributes);
    } catch (err) {
        console.error('Error:', err);
        throw new createErrors(err);
    }
}

function getUpdateExpression() {
    let expression = [];
    expression.push([' SET first_name = :fname', ' last_name= :lname']);
    expression.push([' city = :city', ' zip = :zip', ' address = :address']);
    expression.push([' email = :email', ' phone = :phone', ' mobil = :mobil']);
    expression.push([' admission_date = :admission_date'])
    return expression.toString();
}

function getUpdateExpressionValues(user) {
    return {
        ":fname": user.first_name,
        ":lname": user.last_name,
        ":city": user.city,
        ":zip": user.zip,
        ":address": user.address,
        ":email": user.email,
        ":phone": user.phone,
        ":mobil": user.mobil,
        ":admission_date": user.admission_date

    };
}

function validate(item) {
    util.validateItem(item, 'user_name')
    util.validateItem(item, 'first_name');
    util.validateItem(item, 'last_name');
    util.validateItem(item, 'email');
    util.validateItem(item, 'city');
    util.validateItem(item, 'address');
    util.validateItem(item, 'zip');
}

const handler = middy(updateHandler)
handler.use(middlewares);

module.exports = {
    handler
}
