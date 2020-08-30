const schema = {
    properties: {
        body: {
            type: 'object',
            properties: {
                item: {
                    type: 'object',
                    properties: {
                        event_name: {
                            type: 'string'
                        },
                        event_status: {
                            type: 'string'
                        },
                        meeting_point: {
                            type: 'string'
                        },
                        starting_date: {
                            type: 'string'
                        },
                        ending_date: {
                            type: 'string'
                        },
                      
                    },
                    required: ['event_name','event_status', 'meeting_point', 'starting_date', 'ending_date']

                },
            },
            required: ['item']
        },

    },
    required: ['body']
}


module.exports = {
    schema
}
