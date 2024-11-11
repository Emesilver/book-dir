"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDBClient = void 0;
exports.buildSETUpdateExpression = buildSETUpdateExpression;
exports.buildREMOVEUpdateExpression = buildREMOVEUpdateExpression;
exports.objectToDDB = objectToDDB;
exports.ddbToObject = ddbToObject;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
/**
 * Creates a list of props to be used in a SET UpdateExpression
 */
function buildSETUpdateExpression(obj) {
    return 'SET ' + Object.keys(obj).map((key) => key + '=:' + key).join(', ');
}
/**
 * Creates a list of fields to be used at REMOVE UpdateExpression
 */
function buildREMOVEUpdateExpression(fields) {
    return 'REMOVE ' + fields.join(', ');
}
/**
 * Converts an object to DynamoDB format:
 * Record<string, AttributeValue>
 */
function objectToDDB(obj, keyNamePrefix) {
    if (!obj)
        return;
    const convMap = (objMap) => {
        const retObjMap = {};
        for (const key of Object.keys(objMap)) {
            if (typeof objMap[key] === 'object')
                retObjMap[key] = { M: convMap(objMap[key]) };
            else {
                const attributeValue = buildAttributeValue(objMap[key]);
                if (attributeValue)
                    retObjMap[key] = attributeValue;
            }
        }
        return retObjMap;
    };
    const retObject = {};
    for (const key of Object.keys(obj)) {
        const newKey = keyNamePrefix ? keyNamePrefix + key : key;
        if (typeof obj[key] === 'object')
            retObject[newKey] = { M: convMap(obj[key]) };
        else {
            const attributeValue = buildAttributeValue(obj[key]);
            if (attributeValue)
                retObject[newKey] = attributeValue;
        }
    }
    return retObject;
}
/**
 * Converts an DynamoDB item to object
 */
function ddbToObject(rawItem) {
    const retObj = {};
    for (const key of Object.keys(rawItem)) {
        if (key !== 'pk' && key !== 'sk') {
            if (rawItem[key].M)
                retObj[key] = ddbToObject(rawItem[key].M);
            else
                retObj[key] = buildObjectProp(rawItem[key]);
        }
    }
    return retObj;
}
/**
 * Returns an AttributeValue according to the value type
 */
function buildAttributeValue(value) {
    switch (typeof value) {
        case 'string': return { S: value };
        case 'boolean': return { BOOL: value };
        case 'number': return { N: value.toString() };
    }
}
/**
 * Returns the value depending on AttributeValue type
 */
function buildObjectProp(attValue) {
    const attValueType = Object.keys(attValue)[0];
    switch (attValueType) {
        case 'S': return attValue.S;
        case 'N': return parseFloat(attValue.N);
        case 'BOOL': return attValue.BOOL;
    }
}
class DDBClient {
    constructor() { }
    static client() {
        if (!DDBClient.instance) {
            DDBClient.instance = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
            ;
        }
        return DDBClient.instance;
    }
}
exports.DDBClient = DDBClient;
