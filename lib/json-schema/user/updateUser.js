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
                    },
                    required: ['PK', 'SK', 'user_name', 'first_name', 'last_name', 'city', 'zip', 'address']

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
