const AWS = require('aws-sdk');
const createError = require('http-errors');
let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}

if (process.env.JEST_WORKER_ID) {
    options = {
        endpoint: 'http://localhost:8000',
        region: 'local-env',
        sslEnabled: false,
    };
}

const documentClient = new AWS.DynamoDB.DocumentClient(options);

const Dynamo = {
    /**
     *
     * @param TableName
     * @param PK
     * @returns {Promise<*>}
     */
    async getByKey(TableName, PK) {
        let item;
        const params = {
            TableName,
            Key: {
                PK,
            },
        };

        const data = await documentClient.get(params).promise();
        if (data && data.Item) {
            item = data.Item;
        }
        return item;
    },


    /**
     *
     * @param TableName
     * @param PK
     * @param SK
     * @returns {Promise<*>}
     */
    async getByKeys(TableName, PK, SK) {
        let item;
        const params = {
            TableName,
            Key: {
                PK,
                SK
            },
        };

        let data = await documentClient.get(params).promise();

        if (data && data.Item) {
            item = data.Item;
        }
        return item;
    },
    /**
     *
     * @param TableName
     * @param PK
     * @returns {Promise<*>}
     */
    async getAll(TableName, PK) {
        let items = [];
        const params = {
            TableName,
            KeyConditionExpression: 'PK = :pk ',
            ExpressionAttributeValues: {':pk': PK},
        };

        const data = await documentClient.query(params).promise();

        if (data && data.Items) {
            items = data.Items;
        }
        return items;


    },

    async getAllWithProjections(TableName, PK, projections) {
        let items = [];
        const params = {
            TableName,
            ProjectionExpression: projections,
            KeyConditionExpression: 'PK = :pk ',
            ExpressionAttributeValues: {':pk': PK},
        };

        const data = await documentClient.query(params).promise();
        if (data && data.Items) {
            items = data.Items;
        }
        return items;
    },
    /**
     /* *
     *
     * @param TableName
     * @param keys
     * @param values
     * @returns {Promise<null|*>}
     */
    async queryByIndex(TableName, index, keys, values) {
        let items = [];
        const params = {
            TableName,
            IndexName: index,
            KeyConditionExpression: keys,
            ExpressionAttributeValues: values
        };

        const data = await documentClient.query(params).promise();
        if (data && data.Items) {
            items = data.Items;
        }
        return items;


    },
    /**
     *
     * @param TableName
     * @param data
     * @returns {Promise<{body: *, statusCode: number}>}
     */
    async write(TableName, data) {
        if (!data.PK) {
            throw Error('no PK on the data');
        }
        const params = {
            TableName,
            Item: data
        };
        let response = await documentClient.put(params).promise();
        return data;
    },
    /**
     *
     * @param TableName
     * @param PK
     * @param SK
     * @param updateExpression
     * @param updateValues
     * @returns {Promise<{body: *, statusCode: number}>}
     */
    async update(TableName, PK, SK, updateExpression, updateValues) {
        const params = {
            TableName,
            Key: {
                PK,
                SK
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: updateValues
        };
        let response = await documentClient.update(params).promise();
        return null;

    },
    /**
     *
     * @param TableName
     * @param PK
     * @param SK
     * @returns {Promise<{statusCode: number}>}
     */
    async remove(TableName, PK, SK) {
        let params = {
            TableName, Key: {
                PK
            }
        }
        if (arguments.length === 3) {
            params.Key.SK = SK;
        }
        await documentClient.delete(params).promise();
        return null;
    },

    async search(TableName, PK, SK, searchTerm) {
        let items = [];
        const params = {
            TableName: TableName,
            KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
            ExpressionAttributeNames: {
                "#pk": "PK",
                "#sk": 'SK'
            },
            ExpressionAttributeValues: {
                ':pk': PK,
                ":sk": SK + searchTerm
            }
        }

        const data = await documentClient.query(params).promise();

        if (data && data.Items) {
            items = data.Items;
        }
        return items;
    },


};
module.exports = Dynamo;
