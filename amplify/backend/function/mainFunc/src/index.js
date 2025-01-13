"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const seed_prods_1 = require("./seed-prods");
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
    await (0, seed_prods_1.seedProds)();
    //await testQueryProdNamesByNameCache();
    return { result: "OK - Typescript" };
}
exports.handler = handler;
