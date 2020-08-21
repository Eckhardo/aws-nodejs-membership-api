'use strict';

const user = {
    "zip": 20255,
    "address": "Lutterothstrasse 89",
    "is_active": true,
    "city": "Hamburg",
    "user_name": "Karlotta",
    "last_name": "Kirschning",
    "mobil": "+4916097023201",
    "is_admin": true,
    "password": "abc",
    "phone": "+4916097023201",
    "admission_date": 2011,
    "SK": "profile",
    "PK": "user_Karlo",
    "first_name": "Karl",
    "email": "karl.kirschning@freenet.de"
}

const update = require('./api/user/update');
console.log("keys.....", getUpdateExpression(""))
console.log("values.....", getUpdateExpressionValues(user))
function getUpdateExpression(user) {
    let expression = [];
    expression.push([' SET first_name = :fname', ' last_name= :lname']);
    expression.push([' city = :city', ' zip = :zip', ' address = :address']);
    expression.push([' email = :email', ' phone = :phone', ' mobile = :mobile']);
    expression.push([' admission_date = :date'])
    return expression.toString();
}


function getUpdateExpression2(user) {
    let expression = [];
    expression.push([' SET first_name = fname', ' last_name= lname']);
    expression.push([' city = city', ' zip = zip', ' address = address']);
    expression.push([' email = email', ' phone = phone', ' mobil = mobil']);
    expression.push([' admission_date = date'])
    return expression.toString();
}

function getUpdateExpressionValues(user) {
    let expressionValues = {
        fname : user.first_name,
        lname : user.last_name,
        city : user.city,
        zip: user.zip,
        address: user.address,
        email: user.email,
        phone: user.phone,
        mobil:user.mobil,
        date: user.admission_date

    };
    return expressionValues;

}



