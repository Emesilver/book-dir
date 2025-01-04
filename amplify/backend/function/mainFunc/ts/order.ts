import {
  AfterReadFilter,
  InefficientFilter,
  QueryOptions,
  SKFilter,
} from "./ddb";
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
  console.log("Order detail:", orderGroup);
  return orderGroup;
}

export async function getRecentOrder(customer: string) {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const queryOptions: QueryOptions = {
    skFilter: { skBeginsWith: "ORD#" },
    scanForward: false,
    limit: 1,
  };
  const recentOrderQry = await cadRep.queryDDBItems<Order>(
    customer,
    queryOptions
  );
  let ret = null;
  if (recentOrderQry.length === 1) ret = recentOrderQry[0];
  console.log("Recent order:", ret);
  return ret;
}

export async function queryBigOrders(customer: string, minimumValue: number) {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const skFilter: SKFilter = {
    skBeginsWith: "ORD#",
  };
  const afterReadFilter: AfterReadFilter = {
    filterExpression: "total_value >= :minimumValue",
    expressionAttributeValues: {
      ":minimumValue": { N: minimumValue.toFixed(2) },
    },
  };
  const inefficientFilter: InefficientFilter = {
    queryOptions: { skFilter },
    afterReadFilter: afterReadFilter,
  };
  const bigOrders = await cadRep.inefficientQueryDDBItems<Order>(
    customer,
    inefficientFilter
  );
  console.log("Big orders:", bigOrders);
  return bigOrders;
}
