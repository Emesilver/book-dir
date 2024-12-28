import { QueryOptions, SKFilter } from "./ddb";
import { DDBRepository } from "./ddb-repository";
import { DDBClient } from "./ddb-utils";
import { Order, OrderGroup, OrderItem, OrderPayment } from "./order.type";

export async function queryOrdersByCustomer(customer: string) {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const skFilter: SKFilter = {
    skBeginsWith: "ORD#",
  };
  const queryOptions: QueryOptions = { skFilter };
  const orders = await cadRep.queryDDBItems<Order>(customer, queryOptions);
  console.log("Orders:", orders);
  return orders;
}

export async function queryOrderDetail(customer: string, orderId: string) {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const skFilterItem: SKFilter = {
    skBeginsWith: "ORD-IT#" + orderId,
  };
  const skFilterPaymnt: SKFilter = {
    skBeginsWith: "ORD-PM#" + orderId,
  };
  
  // Leitura em paralelo
  const [order, items, payments] = await Promise.all([
    cadRep.getDDBItem<Order>(customer, "ORD#" + orderId),
    cadRep.queryDDBItems<OrderItem>(customer, { skFilter: skFilterItem }),
    cadRep.queryDDBItems<OrderPayment>(customer, { skFilter: skFilterPaymnt }),
  ]);
  
  const orderGroup: OrderGroup = {
    order,
    items,
    payments,
  };
  console.log("Order detail:", orderGroup)
  return orderGroup;
}
