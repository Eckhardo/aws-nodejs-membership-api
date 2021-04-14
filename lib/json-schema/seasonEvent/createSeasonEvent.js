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
                        season_year: {
                            type: 'number'
                        },
                        meeting_point: {
                            type: 'string'
                        },
                        finished: {
                            type: 'boolean'
                        },
                        starting_date: {
                            type: 'string'
                        },
                        ending_date: {
                            type: 'string'
                        },
                        starting_time: {
                            type: 'string'
                        },
                        ending_time: {
                            type: 'string'
                        },
                    },
                    required: ['event_name', 'season_year',  'meeting_point','starting_date','ending_date', 'starting_time', 'ending_time']

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
