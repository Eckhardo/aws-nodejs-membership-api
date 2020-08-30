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
        const closedPromises = eventsToClose.map(ev => {
            return closeEvents.handler(ev);
        })
        if (closedPromises) {
            console.log("Promise.all: called");
            await Promise.all(closedPromises);
        }
        return {
            statusCode: 200,
            headers: util.getResponseHeaders()
        };
    } catch (e) {
        console.error(e);
        util.makeErrorResponse(e);
    }

}
