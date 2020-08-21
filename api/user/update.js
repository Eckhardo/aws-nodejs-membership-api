const util = require('../util.js');
const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const databaseManager = require('../dynamoDbConnect');
const dynamoDb = databaseManager.connectDynamoDB(TABLE_NAME);
const SORT_KEY_VALUE = 'profile';
const HASK_KEY_PREFIX = 'user_';
const delimiter = ' ';


function getUpdateExpression() {
    let expression = [];
    expression.push([' SET first_name = fname', ' last_name= lname']);
    expression.push([' city = city', ' zip = zip', ' address = address']);
    expression.push([' email = email', ' phone = phone', ' mobil = mobil']);
    expression.push([' admission_date = date'])
    return expression.toString();
}

function getUpdateExpressionValues(user) {
    let expressionValues = {
        fname: user.first_name,
        lname: user.last_name,
        city: user.city,
        zip: user.zip,
        address: user.address,
        email: user.email,
        phone: user.phone,
        mobil: user.mobil,
        date: user.admission_date

    };
    return expressionValues;

}

exports.handler = async (event) => {
    try {
        const user = JSON.parse(event.body);
        const username = user.user_name;
        util.validate(username);
        const pk = HASK_KEY_PREFIX + username;
        const updateExpression = getUpdateExpression();
        const updateExpressionValues = getUpdateExpressionValues(user);
        console.log('updateExpression: ', updateExpression);
        console.log('updateExpressionValues: ', updateExpressionValues);
        const params = {

            TableName: TABLE_NAME,
            Key: {PK: pk, SK : SORT_KEY_VALUE},
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: updateExpressionValues,
            ReturnValues: "UPDATED_NEW"

        };
        let data = dynamoDb.update(params).promise();
        return util.makeSingleResponse(data);
    } catch (err) {
        return util.makeErrorResponse(err);
    }

}
