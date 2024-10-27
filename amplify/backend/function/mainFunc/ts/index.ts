import { createProd, getProdTST, putProdTST, updateProdTST } from "./prod";

export async function handler(event: any) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    // await createProd();
    // await getProdTST();
    // await putProdTST();
    await updateProdTST();
    return {result: 'OK - Typescript'};
}
