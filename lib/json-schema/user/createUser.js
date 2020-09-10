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
                        first_name: {
                            type: 'string'
                        },
                        last_name: {
                            type: 'string'
                        },
                        city: {
                            type: 'string'
                        },
                        address: {
                            type: 'string'
                        },
                        zip: {
                            type: 'number'
                        },
                        email: {
                            type: 'string'
                        },

                    },
                    required: ['user_name', 'first_name', 'last_name', 'city', 'zip', 'address','email']

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
