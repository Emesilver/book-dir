"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const order_1 = require("./order");
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
    //await seedOrders();
    //await queryOrdersByCustomer('CLI001');
    await (0, order_1.queryOrderDetail)('CLI001', '241228AC12');
    return { result: 'OK - Typescript' };
}
