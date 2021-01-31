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
                        membership_year: {
                            type: 'string'
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
                    required: ['user_name','membership_year', 'position_role', 'fees_paid', 'is_active']

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
