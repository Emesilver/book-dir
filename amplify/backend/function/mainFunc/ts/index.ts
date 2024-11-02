import { createProd, createProds, getProdTST, putProdTST, upsertProds, updateProdTST } from "./prod";

export async function handler(event: any) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    // await createProd();
    // await getProdTST();
    // await putProdTST();
    // await updateProdTST();
    // await createProds();
    await upsertProds();
    return {result: 'OK - Typescript'};
}
