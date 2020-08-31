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
                        is_active: {
                            type: 'boolean'
                        },
                        is_admin: {
                            type: 'boolean'
                        },
                    },
                    required: ['user_name','first_name', 'last_name', 'city', 'zip', 'address', 'is_active','is_admin']

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
