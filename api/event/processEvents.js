'use strict';
const endedEvents= require('./getEndedEvents');
exports.handler = async (event, context) =>{

    console.log("processEvents: start");

    const result= await endedEvents.handler();
    console.log("processEvents: result", result);

}
