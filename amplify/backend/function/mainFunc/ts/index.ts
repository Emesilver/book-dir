import { queryPaymentTypesByName } from "./pay-type";
import { createProd, createProds, getProdTST, putProdTST, upsertProds, updateProdTST, readProd, queryProds } from "./prod";

export async function handler(event: any) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    // await createProd();
    // await getProdTST();
    // await putProdTST();
    // await updateProdTST();

    // await createProds();
    // await upsertProds();
    // await readProd();
    // await queryProds();
    await queryPaymentTypesByName();

    return {result: 'OK - Typescript'};
}
