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
                        event_short: {
                            type: 'string'
                        },

                      
                    },
                    required: ['event_name','event_short']

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
