"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const pay_type_1 = require("./pay-type");
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
    // await scanProds();
    await (0, pay_type_1.queryPaymentTypesByName)();
    return { result: 'OK - Typescript' };
}
