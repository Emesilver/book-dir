import {
  getRecentOrder,
  queryBigOrders,
  queryOrderDetail,
  queryOrdersByCustomer,
} from "./order";
import { queryPaymentTypesByName } from "./pay-type";
import {
  createProd,
  getProd,
  createProds,
  testCmd,
  getProdTST,
  putProdTST,
  upsertProds,
  updateProdTST,
  readProd,
  queryProds,
  scanProds,
  queryProdNamesByName,
  testQueryProdNamesByName,
  testQueryProdNamesByNameCache,
  testMemory,
} from "./prod";
import { seedOrders } from "./seed-orders";
import { seedProds } from "./seed-prods";

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
  //await getRecentOrder('CLI001')
  //await queryBigOrders('CLI001', 100)
  //await seedProds();
  //await queryProdNamesByName("MO");
  //await testQueryProdNamesByName();
  await testQueryProdNamesByNameCache();
//  await testMemory();

  return { result: "OK - Typescript" };
}
