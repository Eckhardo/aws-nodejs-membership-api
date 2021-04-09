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
                        season_name: {
                            type: 'string'
                        },
                        season_date: {
                            type: 'string'
                        },

                    },
                    required: ['PK', 'SK', 'season_name', 'season_date']

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
