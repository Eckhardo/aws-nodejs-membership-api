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
                        event_short: {
                            type: 'string'
                        },

                    },
                    required: ['PK', 'SK','event_name','event_short']

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
