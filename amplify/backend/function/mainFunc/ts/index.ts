import { createProd, createProds, getProdTST, putProdTST, upsertProds, updateProdTST, readProd } from "./prod";

export async function handler(event: any) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    // await createProd();
    // await getProdTST();
    // await putProdTST();
    // await updateProdTST();

    // await createProds();
    // await upsertProds();
    await readProd();

    return {result: 'OK - Typescript'};
}
