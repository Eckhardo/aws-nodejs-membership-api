'use strict';


const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb = require('../../api/Dynamo');
const GSI_STATUS_ENDING_DATE ='statusEndingDate-Index';
exports.handler = async () => {
    console.log('getEndedEvents::start');
    const now = new Date();


    const result = await dynamoDb.queryByIndex(TABLE_NAME, GSI_STATUS_ENDING_DATE,'event_status =:event_status AND ending_date >= :now',{':event_status': 'OPEN', ':now': now.toISOString()});
    console.log('getEndedEvents::result: ', result);
    return result.Items;

}
