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
        const params = {
            TableName,
            Key: {
                PK,
            },
        };

        const data = await documentClient.get(params).promise();
        if (data && data.Item) {
            return data.Item;
        }
        console.log('DynamoDB GET User:', JSON.stringify(data));
        return null;
    },
    /**
     *
     * @param TableName
     * @param PK
     * @param SK
     * @returns {Promise<*>}
     */
    async getByKeys(TableName, PK, SK) {
        const params = {
            TableName,
            Key: {
                PK,
                SK
            },
        };
        let data = await documentClient.get(params).promise();
        if (data && data.Item) {
            return data.Item;
        }
        console.log('DynamoDB GET User:', JSON.stringify(data));
        return null;
    },
    /**
     *
     * @param TableName
     * @param PK
     * @returns {Promise<*>}
     */
    async getAll(TableName, PK) {
        const params = {
            TableName,
            KeyConditionExpression: 'PK = :pk ',
            ExpressionAttributeValues: {':pk': PK},
        };

        const data = await documentClient.query(params).promise();

        if (data && data.Items) {
            return data.Items;
        }
        return null;


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
        const params = {
            TableName,
            IndexName: index,
            KeyConditionExpression: keys,
            ExpressionAttributeValues: values
        };

        const data = await documentClient.query(params).promise();

        if (data && data.Items) {
            return data.Items;
        }
        return null;


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
        console.log("Item  create:", JSON.stringify(data));
        await documentClient.put(params).promise();
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
        console.log("Item:", JSON.stringify(params));
        await documentClient.update(params).promise();

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
        const params = {
            TableName,
            Key: {
                PK,
                SK
            },
        };

        await documentClient.delete(params).promise();
        return null;
    },
};
module.exports = Dynamo;
