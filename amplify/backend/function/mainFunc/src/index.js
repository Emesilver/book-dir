"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const prod_1 = require("./prod");
async function handler(event) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    // await createProd();
    // await getProdTST();
    // await putProdTST();
    // await updateProdTST();
    // await createProds();
    // await upsertProds();
    await (0, prod_1.readProd)();
    return { result: 'OK - Typescript' };
}
