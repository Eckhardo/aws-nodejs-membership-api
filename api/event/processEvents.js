'use strict';
const util = require('../util')
const endedEvents = require('./getEndedEvents');
const closedEvents = require('./closeEvent');
exports.handler = async (event, context) => {

    console.log("processEvents: start");

    try {
        const eventsToClose = await endedEvents.handler();
        console.log("eventsToClose: result", eventsToClose);
        // this is heavy.....
        const closedPromises = eventsToClose.map(ev => {
            return closedEvents.handler(ev);
        })
        await Promise.all(closedPromises);
    } catch (e) {
        console.error(e);
        util.makeErrorResponse(e);
    }

}
