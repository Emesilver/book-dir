"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putDDBRawItem = putDDBRawItem;
exports.updateDDBRawItem = updateDDBRawItem;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
async function putDDBRawItem(ddbClient, tableName, rawItem) {
    const params = {
        TableName: tableName,
        Item: rawItem
    };
    try {
        await ddbClient.send(new client_dynamodb_1.PutItemCommand(params));
    }
    catch (error) {
        console.log('Falha em putDDBItem:', error.message);
    }
}
async function updateDDBRawItem(ddbClient, tableName, key, updateExp, expAttValues) {
    const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExp,
        ExpressionAttributeValues: expAttValues
    };
    try {
        await ddbClient.send(new client_dynamodb_1.UpdateItemCommand(params));
    }
    catch (error) {
        console.log('Falha em updateDDBItem:', error.message);
    }
}
