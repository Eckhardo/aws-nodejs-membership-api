const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const HASH_KEY_PREFIX = process.env.HASH_KEY_PREFIX_USER;
const SORT_KEY_VALUE = process.env.SORT_KEY_USER_VALUE;
const get = require('./get')

function getUpdateExpression() {
    let expression = [];
    expression.push([' SET first_name = :fname', ' last_name= :lname']);
    expression.push([' city = :city', ' zip = :zip', ' address = :address']);
    expression.push([' email = :email', ' phone = :phone', ' mobil = :mobil']);
    expression.push([' admission_date = :admission_date'])
    return expression.toString();
}

function getUpdateExpressionValues(user) {
    let expressionValues = {
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
    return expressionValues;

}

exports.handler = async (event) => {
    try {
        console.log("update  user.... started");
        const item = JSON.parse(event.body);
        util.validateItem(item, 'user_name');
        let user =await  get.getUser(item.user_name);

        console.log("item user", item.user_name);
        console.log("user user", user.user_name);
         if(! user && (! user.user_name === item.user_name)){
             return {
                 statusCode: 500,
                 headers: getResponseHeaders(),
                 body: JSON.stringify(` user with username ${item.user_name} is unknown !`)
             };
         }
        const pk = HASH_KEY_PREFIX + item.user_name;
        const updateExpression = getUpdateExpression();
        const updateExpressionValues = getUpdateExpressionValues(item);

        console.log('updateExpressionValues: ', updateExpressionValues);
        const params = {

            TableName: TABLE_NAME,
            Key: {PK: pk, SK : SORT_KEY_VALUE},
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: updateExpressionValues,
            ReturnValues: "UPDATED_NEW"

        };
        let data = await  dynamoDb.update(params).promise();
         return util.makeSingleResponseAttributes(data.Attributes);
    } catch (err) {
        return util.makeErrorResponse(err);
    }

}
