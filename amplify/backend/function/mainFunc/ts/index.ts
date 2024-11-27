import { queryPaymentTypesByName } from "./pay-type";
import { createProd, getProd, createProds,
    getProdTST, putProdTST, upsertProds, updateProdTST, readProd, queryProds, scanProds } from "./prod";

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
    await scanProds();
    // await queryPaymentTypesByName();

    return {result: 'OK - Typescript'};
}
