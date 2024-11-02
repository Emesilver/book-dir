"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDBClient = void 0;
exports.buildUpdateExpression = buildUpdateExpression;
exports.objectToDDB = objectToDDB;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
/**
 * Create a list of props to be used at UpdateExpression
 */
function buildUpdateExpression(obj) {
    return Object.keys(obj).map((key) => key + '=:' + key).join(', ');
}
/**
 * Converte um objeto para formato de gravacao Dynamo:
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
 * Return an AttributeValue according to the value type
 */
function buildAttributeValue(value) {
    switch (typeof value) {
        case 'string': return { S: value };
        case 'boolean': return { BOOL: value };
        case 'number': return { N: value.toString() };
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
