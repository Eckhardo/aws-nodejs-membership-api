const schema = {
    properties: {
        body: {
            type: 'object',
            properties: {
                item: {
                    type: 'object',
                    properties: {
                        user_name: {
                            type: 'string'
                        },
                        event_name: {
                            type: 'string'
                        },
                        season_year: {
                            type: 'number'
                        },
                        took_part: {
                            type: 'boolean'
                        },
                        registered: {
                            type: 'boolean'
                        },

                    },
                    required: ['user_name', 'season_year', 'event_name']

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
