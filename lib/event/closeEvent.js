'use strict';


const TABLE_NAME = process.env.CONFIG_USER_TABLE;
const dynamoDb =require('../../api/Dynamo');
/**
 *
 * @param theEvent
 * @returns {Promise<DocumentClient.UpdateItemOutput & {$response: Response<DocumentClient.UpdateItemOutput, AWSError>}>}
 */
exports.handler = async (theEvent) => {


    const pk= theEvent.PK;
    const sk = theEvent.SK;

  await dynamoDb.update(TABLE_NAME,pk,sk,'SET event_status = :event_status',{':event_status': 'CLOSED'});

  return null;

}
