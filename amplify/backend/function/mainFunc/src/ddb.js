"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDDBRawTran = exports.writeDDBRawTran = exports.WriteDDBRawTranType = exports.inefficientQueryDDBRawItems = exports.scanDDBRawItems = exports.queryDDBRawItems = exports.getDDBRawItem = exports.updateDDBRawItem = exports.putDDBRawItem = void 0;
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
        Item: rawItem,
    };
    try {
        await ddbClient.send(new client_dynamodb_1.PutItemCommand(params));
    }
    catch (error) {
        console.log("putDDBRawItem failed:", error.message);
    }
}
exports.putDDBRawItem = putDDBRawItem;
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
        ExpressionAttributeValues: expAttValues,
    };
    try {
        await ddbClient.send(new client_dynamodb_1.UpdateItemCommand(params));
    }
    catch (error) {
        console.log("updateDDBRawItem failed:", error.message);
    }
}
exports.updateDDBRawItem = updateDDBRawItem;
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
        Key: key,
    };
    try {
        const getResult = await ddbClient.send(new client_dynamodb_1.GetItemCommand(params));
        return getResult.Item;
    }
    catch (error) {
        throw new Error("getDDBRawItem failed:" + error.message);
    }
}
exports.getDDBRawItem = getDDBRawItem;
/**
 * Query items on a table or index depending on how indexInfo is defined.
 * @param ddbClient Client dynamoDB
 * @param tableName Table name to add data
 * @param pk Partition key value to query on table or index
 * @param queryOptions Index and sort key information to filter
 * @returns Records in DynamoDB format
 */
async function queryDDBRawItems(ddbClient, tableName, pk, queryOptions) {
    const pkFieldName = queryOptions?.indexInfo
        ? queryOptions.indexInfo.pkFieldName
        : "pk";
    const skFieldName = queryOptions?.indexInfo
        ? queryOptions.indexInfo.skFieldName
        : "sk";
    let keysCondition = `${pkFieldName} = :pk`;
    let expAttrValues = { ":pk": { S: pk } };
    if (queryOptions?.skFilter?.sk) {
        keysCondition += ` AND ${pkFieldName} = :sk`;
        expAttrValues[":sk"] = { S: queryOptions.skFilter.sk };
    }
    if (queryOptions?.skFilter?.skBeginsWith) {
        keysCondition += ` AND begins_with(${skFieldName}, :skBW)`;
        expAttrValues[":skBW"] = { S: queryOptions.skFilter.skBeginsWith };
    }
    if (queryOptions?.skFilter?.skBetween) {
        keysCondition += ` AND ${skFieldName} BETWEEN :skStart AND :skEnd`;
        expAttrValues[":skStart"] = { S: queryOptions.skFilter.skBetween.start };
        expAttrValues[":skEnd"] = { S: queryOptions.skFilter.skBetween.end };
    }
    const params = {
        TableName: tableName,
        KeyConditionExpression: keysCondition,
        ExpressionAttributeValues: expAttrValues,
    };
    let expAttrNames = undefined;
    if (pkFieldName.startsWith("#"))
        expAttrNames = { [pkFieldName]: pkFieldName.split("#")[1] };
    if (skFieldName.startsWith("#") && queryOptions?.skFilter)
        expAttrNames = {
            ...expAttrNames,
            [skFieldName]: skFieldName.split("#")[1],
        };
    if (expAttrNames)
        params.ExpressionAttributeNames = expAttrNames;
    if (queryOptions?.indexInfo)
        params.IndexName = queryOptions.indexInfo.indexName;
    if (queryOptions?.limit)
        params.Limit = queryOptions.limit;
    if (queryOptions?.scanForward !== undefined)
        params.ScanIndexForward = queryOptions.scanForward;
    try {
        let queryResult;
        let allItems = [];
        let limitMet = false;
        do {
            params.ExclusiveStartKey = queryResult?.LastEvaluatedKey;
            queryResult = await ddbClient.send(new client_dynamodb_1.QueryCommand(params));
            allItems = allItems.concat(queryResult.Items);
            if (queryOptions?.limit) {
                if (allItems.length > queryOptions.limit)
                    allItems = allItems.slice(0, queryOptions.limit);
                limitMet = allItems.length === queryOptions.limit;
            }
        } while (queryResult.LastEvaluatedKey && !limitMet);
        return allItems;
    }
    catch (error) {
        throw new Error("queryDDBRawItems failed:" + error.message);
    }
}
exports.queryDDBRawItems = queryDDBRawItems;
async function scanDDBRawItems(ddbClient, tableName, scanOptions) {
    const params = {
        TableName: tableName,
    };
    if (scanOptions?.scanFilter) {
        params.FilterExpression = scanOptions.scanFilter.filterExpression;
        params.ExpressionAttributeValues =
            scanOptions.scanFilter.expressionAttributeValues;
    }
    try {
        let scanResult;
        let allItems = [];
        do {
            params.ExclusiveStartKey = scanResult?.LastEvaluatedKey;
            scanResult = await ddbClient.send(new client_dynamodb_1.ScanCommand(params));
            allItems = allItems.concat(scanResult.Items);
        } while (scanResult.LastEvaluatedKey);
        return allItems;
    }
    catch (error) {
        throw new Error("scanDDBRawItems failed:" + error.message);
    }
}
exports.scanDDBRawItems = scanDDBRawItems;
/**
 * Query items on a table or index using FilterExpression.
 * USE IT CAREFULLY!
 * @param ddbClient Client dynamoDB
 * @param tableName Table name to add data
 * @param pk Partition key value to query on table or index
 * @param inefficientFilter Filter expression and query options info
 * @returns Records in DynamoDB format
 */
async function inefficientQueryDDBRawItems(ddbClient, tableName, pk, inefficientFilter) {
    const pkFieldName = inefficientFilter?.queryOptions?.indexInfo
        ? inefficientFilter?.queryOptions.indexInfo.pkFieldName
        : "pk";
    const skFieldName = inefficientFilter?.queryOptions?.indexInfo
        ? inefficientFilter?.queryOptions.indexInfo.skFieldName
        : "sk";
    let keysCondition = `${pkFieldName} = :pk`;
    let expAttrValues = { ":pk": { S: pk } };
    if (inefficientFilter?.queryOptions?.skFilter?.sk) {
        keysCondition += ` AND ${pkFieldName} = :sk`;
        expAttrValues[":sk"] = { S: inefficientFilter?.queryOptions.skFilter.sk };
    }
    if (inefficientFilter?.queryOptions?.skFilter?.skBeginsWith) {
        keysCondition += ` AND begins_with(${skFieldName}, :skBW)`;
        expAttrValues[":skBW"] = {
            S: inefficientFilter?.queryOptions.skFilter.skBeginsWith,
        };
    }
    if (inefficientFilter?.queryOptions?.skFilter?.skBetween) {
        keysCondition += ` AND ${skFieldName} BETWEEN :skStart AND :skEnd`;
        expAttrValues[":skStart"] = {
            S: inefficientFilter?.queryOptions.skFilter.skBetween.start,
        };
        expAttrValues[":skEnd"] = {
            S: inefficientFilter?.queryOptions.skFilter.skBetween.end,
        };
    }
    const params = {
        TableName: tableName,
        KeyConditionExpression: keysCondition,
        ExpressionAttributeValues: expAttrValues,
    };
    if (inefficientFilter?.queryOptions?.indexInfo)
        params.IndexName = inefficientFilter?.queryOptions.indexInfo.indexName;
    if (inefficientFilter?.queryOptions?.limit)
        params.Limit = inefficientFilter?.queryOptions.limit;
    if (inefficientFilter?.queryOptions?.scanForward !== undefined)
        params.ScanIndexForward = inefficientFilter?.queryOptions.scanForward;
    // Filtering records after consuming RCU ------------
    if (inefficientFilter?.afterReadFilter) {
        params.FilterExpression =
            inefficientFilter.afterReadFilter.filterExpression;
        params.ExpressionAttributeValues = {
            ...params.ExpressionAttributeValues,
            ...inefficientFilter.afterReadFilter.expressionAttributeValues,
        };
    }
    //---------------------------------------------------
    try {
        let queryResult;
        let allItems = [];
        let limitMet = false;
        do {
            params.ExclusiveStartKey = queryResult?.LastEvaluatedKey;
            queryResult = await ddbClient.send(new client_dynamodb_1.QueryCommand(params));
            allItems = allItems.concat(queryResult.Items);
            if (inefficientFilter?.queryOptions?.limit) {
                if (allItems.length > inefficientFilter?.queryOptions.limit)
                    allItems = allItems.slice(0, inefficientFilter?.queryOptions.limit);
                limitMet = allItems.length === inefficientFilter?.queryOptions.limit;
            }
        } while (queryResult.LastEvaluatedKey && !limitMet);
        return allItems;
    }
    catch (error) {
        throw new Error("inefficientQueryDDBRawItems failed:" + error.message);
    }
}
exports.inefficientQueryDDBRawItems = inefficientQueryDDBRawItems;
var WriteDDBRawTranType;
(function (WriteDDBRawTranType) {
    WriteDDBRawTranType["PUT"] = "put";
    WriteDDBRawTranType["UPDATE"] = "update";
    WriteDDBRawTranType["DELETE"] = "delete";
    WriteDDBRawTranType["CONDITION"] = "condition";
})(WriteDDBRawTranType = exports.WriteDDBRawTranType || (exports.WriteDDBRawTranType = {}));
async function writeDDBRawTran(ddbClient, tableName, rawWriteItems) {
    const params = {
        TransactItems: [],
    };
    for (const rawWriteItem of rawWriteItems) {
        if (rawWriteItem.commandType === WriteDDBRawTranType.PUT) {
            const putParam = {
                TableName: tableName,
                Item: rawWriteItem.rawItem,
            };
            const transactionItem = { Put: putParam };
            params.TransactItems.push(transactionItem);
        }
        if (rawWriteItem.commandType === WriteDDBRawTranType.UPDATE) {
            // TODO
        }
        if (rawWriteItem.commandType === WriteDDBRawTranType.DELETE) {
            // TODO
        }
        if (rawWriteItem.commandType === WriteDDBRawTranType.CONDITION) {
            // TODO
        }
    }
    try {
        await ddbClient.send(new client_dynamodb_1.TransactWriteItemsCommand(params));
    }
    catch (error) {
        console.log("writeDDBRawTransaction failed:", error.message);
    }
}
exports.writeDDBRawTran = writeDDBRawTran;
/**
 * Read multiple items in a transaction
 */
async function getDDBRawTran(ddbClient, tableName, rawKeys) {
    const params = {
        TransactItems: [],
    };
    for (const rawKey of rawKeys) {
        const getKey = {
            Key: rawKey,
            TableName: tableName,
        };
        const transactGetItem = {
            Get: getKey,
        };
        params.TransactItems.push(transactGetItem);
    }
    try {
        const transactResult = await ddbClient.send(new client_dynamodb_1.TransactGetItemsCommand(params));
        return transactResult.Responses;
    }
    catch (error) {
        console.log("getDDBRawTransaction failed:", error.message);
    }
}
exports.getDDBRawTran = getDDBRawTran;
