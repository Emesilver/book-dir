"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putDDBRawItem = putDDBRawItem;
exports.updateDDBRawItem = updateDDBRawItem;
exports.getDDBRawItem = getDDBRawItem;
exports.queryDDBRawItems = queryDDBRawItems;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
/**
* Add a new record or override an existing one
* @param ddbClient Client dynamoDB
* @param tableName Table name to add data
* @param rawItem Record to add
*/
async function putDDBRawItem(ddbClient, tableName, rawItem) {
    const params = {
        TableName: tableName,
        Item: rawItem
    };
    try {
        await ddbClient.send(new client_dynamodb_1.PutItemCommand(params));
    }
    catch (error) {
        console.log('putDDBRawItem failed:', error.message);
    }
}
/**
* Update an existing record or add a new one if the key doesn't exist
* @param ddbClient Client dynamoDB
* @param tableName Table name to add data
* @param key Partition and sort keys to update
* @param updateExp Update instruction
* @param expAttValues New values
*/
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
        console.log('updateDDBRawItem failed:', error.message);
    }
}
/**
* Read a DynamoDB item
* @param ddbClient Client dynamoDB
* @param tableName Table name to add data
* @param key Partition and sort keys to find
* @returns a record in DynamoDB format
*/
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
        throw new Error('getDDBRawItem failed:' + error.message);
    }
}
/**
* Query items on a table or index depending on how indexInfo is defined.
* @param ddbClient Client dynamoDB
* @param tableName Table name to add data
* @param indexInfo Information about the index to query
* @param pk Partition key value to query on table or index
* @param skFilter Query sort key instructions
* @returns Records in DynamoDB format
*/
async function queryDDBRawItems(ddbClient, tableName, indexInfo, pk, skFilter) {
    const pkFieldName = indexInfo ? indexInfo.pkFieldName : 'pk';
    const skFieldName = indexInfo ? indexInfo.skFieldName : 'sk';
    let skCondition = '';
    let expAttrValues = { ':pk': { S: pk } };
    if (skFilter?.sk) {
        skCondition = `${pkFieldName} = :sk`;
        expAttrValues[':sk'] = { S: skFilter.sk };
    }
    if (skFilter?.skBeginsWith) {
        skCondition = `begins_with(${skFieldName}, :skBW)`;
        expAttrValues[':skBW'] = { S: skFilter.skBeginsWith };
    }
    if (skFilter?.skBetween) {
        skCondition = `${skFieldName} BETWEEN :skStart AND :skEnd`;
        expAttrValues[':skStart'] = { S: skFilter.skBetween.start };
        expAttrValues[':skEnd'] = { S: skFilter.skBetween.end };
    }
    const params = {
        TableName: tableName,
        KeyConditionExpression: `${pkFieldName} = :pk` + (skCondition ? ' AND ' : '') + skCondition,
        ExpressionAttributeValues: expAttrValues
    };
    if (indexInfo)
        params.IndexName = indexInfo.indexName;
    try {
        const getResult = await ddbClient.send(new client_dynamodb_1.QueryCommand(params));
        return getResult.Items;
    }
    catch (error) {
        throw new Error('queryDDBRawItems failed:' + error.message);
    }
}
