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
                        membership_name: {
                            type: 'string'
                        },
                        membership_year: {
                            type: 'string'
                        },

                    },
                    required: ['PK', 'SK', 'membership_name', 'membership_year']

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
