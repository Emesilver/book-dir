"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryOrdersByCustomer = queryOrdersByCustomer;
exports.queryOrderDetail = queryOrderDetail;
exports.getRecentOrder = getRecentOrder;
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
async function getRecentOrder(customer) {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const queryOptions = {
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
