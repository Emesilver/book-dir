"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const prod_1 = require("./prod");
async function handler(event) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    // await createProd();
    // await getProd();
    // await getProdTST();
    // await putProdTST();
    // await updateProdTST();
    // await createProds();
    // await upsertProds();
    // await readProd();
    // await queryProds();
    await (0, prod_1.scanProds)();
    // await queryPaymentTypesByName();
    return { result: 'OK - Typescript' };
}
