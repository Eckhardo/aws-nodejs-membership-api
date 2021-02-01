'use strict';
const util = require('../util')
const endedEvents = require('../../lib/event/getEndedEvents');
const closeEvents = require('../../lib/event/closeEvent');
exports.handler = async (event, context) => {

    console.log("processEvents: start");

    try {
        const eventsToClose = await endedEvents.handler();
        console.log("eventsToClose: result", eventsToClose);
        // this is heavy.....
        const closedPromises = eventsToClose.map(event => {
            return closeEvents.handler(event);
        })
        if (closedPromises) {
            console.log("Promise.all: called");
            await Promise.all(closedPromises);
        }

    } catch (e) {
        console.error(e);
        util.makeErrorResponse(e);
    }
    return {
        statusCode: 200
    };
}
