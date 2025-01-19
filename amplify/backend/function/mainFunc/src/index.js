"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
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
    // await scanProds();
    // await queryPaymentTypesByName();
    //await testCmd();
    //await seedOrders();
    //await queryOrdersByCustomer('CLI001');
    //await queryOrderDetail('CLI001', '241228AC12')
    //await getRecentOrder('CLI001')
    //await queryBigOrders('CLI001', 100)
    //await seedProds();
    //await queryProdNamesByName("MO");
    //await testQueryProdNamesByName();
    await (0, prod_1.testQueryProdNamesByNameCache)();
    //  await testMemory();
    return { result: "OK - Typescript" };
}
exports.handler = handler;
