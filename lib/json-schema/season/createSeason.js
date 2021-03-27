const schema = {
    properties: {
        body: {
            type: 'object',
            properties: {
                item: {
                    type: 'object',
                    properties: {
                        season_name: {
                            type: 'string'
                        },
                        season_year: {
                            type: 'string'
                        },
                    },
                    required: ['season_name','season_year']

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
