"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const seed_orders_1 = require("./seed-orders");
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
    // await queryPaymentTypesByName();
    //await testCmd();
    await (0, seed_orders_1.seedPedidos)();
    return { result: 'OK - Typescript' };
}
