"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDBRepository = void 0;
const ddb_utils_1 = require("./ddb-utils");
const ddb_1 = require("./ddb");
class DDBRepository {
    constructor(tableName, ddbClient) {
        this.tableName = tableName;
        this.ddbClient = ddbClient;
    }
    async putDDBItem(pk, sk, item) {
        const rawItem = {
            pk: { S: pk },
            sk: { S: sk },
            ...(0, ddb_utils_1.objectToDDB)(item)
        };
        await (0, ddb_1.putDDBRawItem)(this.ddbClient, this.tableName, rawItem);
    }
    async upsertDDBItem(pk, sk, item) {
        const key = { pk: { S: pk }, sk: { S: sk } };
        const updateExp = 'SET ' + (0, ddb_utils_1.buildUpdateExpression)(item);
        const updateExpValues = (0, ddb_utils_1.objectToDDB)(item, ':');
        await (0, ddb_1.updateDDBRawItem)(this.ddbClient, this.tableName, key, updateExp, updateExpValues);
    }
}
exports.DDBRepository = DDBRepository;
