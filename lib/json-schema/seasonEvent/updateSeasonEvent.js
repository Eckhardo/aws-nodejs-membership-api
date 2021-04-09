const schema = {
    properties: {
        body: {
            type: 'object',
            properties: {
                item: {
                    type: 'object',
                    properties: {
                        PK: {
                            type: 'string'
                        },
                        SK: {
                            type: 'string'
                        },
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

                    },
                    required: ['PK', 'SK','event_name', 'season_year', 'finished', 'meeting_point','starting_date','ending_date']

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
