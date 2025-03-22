"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerAndOrder = exports.queryBigOrders = exports.getRecentOrder = exports.queryOrderDetail = exports.queryOrdersByCustomer = void 0;
const ddb_repository_1 = require("./ddb-repository");
const ddb_utils_1 = require("./ddb-utils");
async function queryOrdersByCustomer(customer) {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const skFilter = {
        skBeginsWith: "ORD#",
    };
    const queryOptions = { skFilter };
    const orders = await cadRep.queryDDBItems(customer, queryOptions);
    console.log("Orders:", orders);
    return orders;
}
exports.queryOrdersByCustomer = queryOrdersByCustomer;
async function queryOrderDetail(customer, orderId) {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const skFilterItem = {
        skBeginsWith: "ORD-IT#" + orderId,
    };
    const skFilterPaymnt = {
        skBeginsWith: "ORD-PM#" + orderId,
    };
    // Leitura em paralelo
    const [order, items, payments] = await Promise.all([
        cadRep.getDDBItem(customer, "ORD#" + orderId),
        cadRep.queryDDBItems(customer, { skFilter: skFilterItem }),
        cadRep.queryDDBItems(customer, { skFilter: skFilterPaymnt }),
    ]);
    const orderGroup = {
        order,
        items,
        payments,
    };
    console.log("Order detail:", orderGroup);
    return orderGroup;
}
exports.queryOrderDetail = queryOrderDetail;
async function getRecentOrder(customer) {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const queryOptions = {
        skFilter: { skBeginsWith: "ORD#" },
        scanForward: false,
        limit: 1,
    };
    const recentOrderQry = await cadRep.queryDDBItems(customer, queryOptions);
    let ret = null;
    if (recentOrderQry.length === 1)
        ret = recentOrderQry[0];
    console.log("Recent order:", ret);
    return ret;
}
exports.getRecentOrder = getRecentOrder;
async function queryBigOrders(customer, minimumValue) {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const skFilter = {
        skBeginsWith: "ORD#",
    };
    const afterReadFilter = {
        filterExpression: "total_value >= :minimumValue",
        expressionAttributeValues: {
            ":minimumValue": { N: minimumValue.toFixed(2) },
        },
    };
    const inefficientFilter = {
        queryOptions: { skFilter },
        afterReadFilter: afterReadFilter,
    };
    const bigOrders = await cadRep.inefficientQueryDDBItems(customer, inefficientFilter);
    console.log("Big orders:", bigOrders);
    return bigOrders;
}
exports.queryBigOrders = queryBigOrders;
async function getCustomerAndOrder(clientId, orderId) {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const customerKey = { pk: clientId, sk: "CUSTOMER" };
    const orderKey = { pk: clientId, sk: "ORD#" + orderId };
    const getTransactionResult = await cadRep.getDDBTransaction(customerKey, orderKey);
    console.log("Customer -> ", getTransactionResult.itemFromKey1);
    console.log("Order -> ", getTransactionResult.itemFromKey2);
}
exports.getCustomerAndOrder = getCustomerAndOrder;
