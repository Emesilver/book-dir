import { queryPaymentTypesByName } from "./pay-type";
import { createProd, getProd, createProds, testCmd,
    getProdTST, putProdTST, upsertProds, updateProdTST, readProd, queryProds, scanProds } from "./prod";
import { seedPedidos } from "./seed-orders";

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

    await seedPedidos();

    return {result: 'OK - Typescript'};
}
