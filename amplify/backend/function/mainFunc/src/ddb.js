"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putDDBRawItem = putDDBRawItem;
exports.updateDDBRawItem = updateDDBRawItem;
exports.getDDBRawItem = getDDBRawItem;
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
        console.log('putDDBItem failed:', error.message);
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
        console.log('updateDDBItem failed:', error.message);
    }
}
async function getDDBRawItem(ddbClient, tableName, key) {
    const params = {
        TableName: tableName,
        Key: key
    };
    try {
        const getResult = await ddbClient.send(new client_dynamodb_1.GetItemCommand(params));
        return getResult.Item;
    }
    catch (error) {
        console.log('getDDBItem failed:', error.message);
    }
}
