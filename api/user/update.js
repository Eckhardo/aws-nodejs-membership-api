const util = require('../util.js');
const TABLE_NAME =process.env.CONFIG_USER_TABLE_OFFLINE;

const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const get = require('./get')
const createError = require('http-errors');
const middy = require('./../../lib/commonMiddleware');
const middyLibs = [middy.httpJsonBodyParser(), middy.httpEventNormalizer(), middy.httpErrorHandler(),middy.httpCors()];
const updateUserSchema = require('./../../lib/json-schema/user/updateUser');


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
    const user_name = item.user_name;
    try {
        //validate input against db
        let user = await get.getUser(user_name);
        if (!user) {
            return {
                statusCode: 400,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(`User with user name ${user_name}  does not exist !`)
            };       }

        const params = {
            TableName: TABLE_NAME,
            Key: {PK: item.PK, SK: process.env.SORT_KEY_USER_VALUE},
            UpdateExpression: getUpdateExpression(),
            ExpressionAttributeValues: getUpdateExpressionValues(item),
            ReturnValues: "UPDATED_NEW"
        };

        const data = await dynamoDb.update(params).promise();
        return util.makeSingleResponseAttributes(data.Attributes);
    } catch (err) {
        console.error('Error:', err);
        throw new createError(err);
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

const handler = middy.middy(updateHandler);
handler.use(middyLibs).use(middy.validator({inputSchema: updateUserSchema.schema}));

module.exports = {
    handler
}
