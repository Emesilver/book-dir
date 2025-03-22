"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCustCli001 = void 0;
const ddb_repository_1 = require("./ddb-repository");
const ddb_utils_1 = require("./ddb-utils");
async function seedCustCli001() {
    const custRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    await custRep.putDDBItem("CLI001", "CUSTOMER", {
        client_id: "CLI001",
        client_name: "EMERSON",
        client_limit: 1000,
    });
    console.log("Client CLI001 added");
}
exports.seedCustCli001 = seedCustCli001;
