'use strict';

const _ = require('underscore');


const getUserId = (headers) => {
    return headers.app_user_id;
}

const getUserName = (headers) => {
    return headers.app_user_name;
}

// Required for CORS support to work
const getResponseHeaders = () => {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    }
}

const validate = (key) => {
    if (!key) {
        throw Error("key value not set ");
    }
    if (_.isNumber(key) || _.isBoolean(key)) {
        return;
    }

    if (_.isEmpty(key)) {
        throw Error("key value ia empty");
    }
}


const validateItem = (item, field) => {
    const has = Object.prototype.hasOwnProperty;
    const hasField = has.call(item, field);
    if (!hasField) {
        console.log(' field not present:', field);
        throw Error(`Field ${field} is not defined in input object`);

    }
}
const makeErrorResponse = (err) => {
    console.log("Error: ", err);
    return {
        statusCode: err.statusCode ? err.statusCode : 500,
        headers: getResponseHeaders(),
        body: JSON.stringify({
            error: err.name ? err.name : "Exception",
            message: err.message ? err.message : "Unknown error"
        })
    };
}
const makeSingleResponseAttributes = (attributes) => {
    if (!_.isEmpty(attributes)) {
        return {
            statusCode: 200,
            headers: getResponseHeaders(),
            body: JSON.stringify(attributes)
        };
    } else {
        return {
            statusCode: 404,
        };
    }
}
const makeSingleResponse = (data) => {
    if (!_.isEmpty(data.Items)) {
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items[0])
        };
    } else {
        return {
            statusCode: 404
        };
    }
}


const makeAllResponse = (data) => {
    if (!_.isEmpty(data.Items)) {
        return {
            statusCode: 200,
            headers: getResponseHeaders(),
            body: JSON.stringify(data.Items)
        };
    } else {
        return {
            statusCode: 404
        };
    }
}

module.exports = {
    getUserId,
    getUserName,
    getResponseHeaders,
    makeErrorResponse,
    makeSingleResponse,
    makeSingleResponseAttributes,
    makeAllResponse,
    validate,
    validateItem
}
