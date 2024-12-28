import { getRecentOrder, queryOrderDetail, queryOrdersByCustomer } from "./order";
import { queryPaymentTypesByName } from "./pay-type";
import { createProd, getProd, createProds, testCmd,
    getProdTST, putProdTST, upsertProds, updateProdTST, readProd, queryProds, scanProds } from "./prod";
import { seedOrders } from "./seed-orders";

export async function handler(event: any) {
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
    await getRecentOrder('CLI001')

    return {result: 'OK - Typescript'};
}
