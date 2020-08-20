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
        'Access-Control-Allow-Origin': '*'
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

const makeSingleResponse = (data) => {
    if (!_.isEmpty(data.Items)) {
        console.log("result not empty ");
        return {
            statusCode: 200,
            headers: getResponseHeaders(),
            body: JSON.stringify(data.Items[0])
        };
    } else {
        return {
            statusCode: 404,
            headers: getResponseHeaders()
        };
    }
}

const  makeAllResponse =(data) =>{
    if (!_.isEmpty(data.Items)) {
        console.log("result not empty ");
        return {
            statusCode: 200,
            headers: getResponseHeaders(),
            body: JSON.stringify(data.Items)
        };
    } else {
        return {
            statusCode: 404,
            headers: getResponseHeaders()
        };
    }
}

module.exports = {
    getUserId,
    getUserName,
    getResponseHeaders,
    makeErrorResponse,
    makeSingleResponse,
    makeAllResponse
}
