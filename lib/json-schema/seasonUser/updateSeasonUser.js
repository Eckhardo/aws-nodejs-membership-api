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

                        user_name: {
                            type: 'string'
                        },
                        season_year: {
                            type: 'number'
                        },
                        position_role: {
                            type: 'string'
                        },
                        fees_paid: {
                            type: 'boolean'
                        },
                        is_active: {
                            type: 'boolean'
                        },

                    },
                    required: ['PK', 'SK','user_name', 'season_year',  'fees_paid', 'is_active']

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
