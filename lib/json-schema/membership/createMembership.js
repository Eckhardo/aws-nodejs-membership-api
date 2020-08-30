const schema = {
    properties: {
        body: {
            type: 'object',
            properties: {
                item: {
                    type: 'object',
                    properties: {
                        membership_name: {
                            type: 'string'
                        },
                        membership_year: {
                            type: 'string'
                        },
                    },
                    required: ['membership_name','membership_year']

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
