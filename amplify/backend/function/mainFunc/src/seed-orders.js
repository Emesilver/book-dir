"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOrders = void 0;
const ddb_repository_1 = require("./ddb-repository");
const ddb_utils_1 = require("./ddb-utils");
async function seedOrders() {
    await saveGroupOrder(buildGroupOrder1());
    await saveGroupOrder(buildGroupOrder2());
    await saveGroupOrder(buildGroupOrder3());
}
exports.seedOrders = seedOrders;
async function saveGroupOrder({ order, items, payments }) {
    const seedOrderRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const pk = order.client_id;
    const prefix = {
        order: "ORD#",
        item: "ORD-IT#",
        payment: "ORD-PM#",
    };
    // Gravar o cabecalho do pedido
    const skOrder = prefix.order + order.order_id;
    console.log("Gravando pedido ", skOrder);
    await seedOrderRep.putDDBItem(pk, skOrder, order);
    // Gravar os items em paralelo
    await Promise.all(items.map(async (item) => {
        const skItem = prefix.item + order.order_id + "#" + item.item_id;
        return seedOrderRep.putDDBItem(pk, skItem, item);
    }));
    // Gravar os pagamentos em paralelo
    await Promise.all(payments.map(async (pagto) => {
        const skPagto = prefix.payment + order.order_id + "#" + pagto.paymnt_id;
        return seedOrderRep.putDDBItem(pk, skPagto, pagto);
    }));
}
function buildGroupOrder1() {
    const pedido = {
        client_id: "CLI001",
        order_id: "241228AC12",
        client_name: "EMERSON",
        creation_date: "2024-12-28T11:23:01.000Z",
        total_value: 120.0,
        record_type: "ORDER",
    };
    const item1 = {
        client_id: "CLI001",
        order_id: "241228AC12",
        item_id: "IT001",
        product_name: "PLACA DE VIDEO",
        quantity: 1,
        price: 80,
        record_type: "ITEM",
    };
    const item2 = {
        client_id: "CLI001",
        order_id: "241228AC12",
        item_id: "IT002",
        product_name: "PROCESSADOR",
        quantity: 2,
        price: 40,
        record_type: "ITEM",
    };
    const pagto1 = {
        client_id: "CLI001",
        order_id: "241228AC12",
        paymnt_id: "PG001",
        paymnt_description: "CARTAO",
        paymnt_value: 60,
        record_type: "PAYMNT",
    };
    const pagto2 = {
        client_id: "CLI001",
        order_id: "241228AC12",
        paymnt_id: "PG002",
        paymnt_description: "CARTAO",
        paymnt_value: 60,
        record_type: "PAYMNT",
    };
    const grupoPedido = {
        order: pedido,
        items: [item1, item2],
        payments: [pagto1, pagto2],
    };
    return grupoPedido;
}
function buildGroupOrder2() {
    const pedido = {
        client_id: "CLI001",
        order_id: "241224BA11",
        client_name: "EMERSON",
        creation_date: "2024-12-24T17:10:00.000Z",
        total_value: 70.0,
        record_type: "ORDER",
    };
    const item1 = {
        client_id: "CLI001",
        order_id: "241224BA11",
        item_id: "IT001",
        product_name: "FONTE ELETRICA",
        quantity: 1,
        price: 70,
        record_type: "ITEM",
    };
    const pagto1 = {
        client_id: "CLI001",
        order_id: "241224BA11",
        paymnt_id: "PG001",
        paymnt_description: "CARTAO",
        paymnt_value: 70,
        record_type: "PAYMNT",
    };
    const grupoPedido = {
        order: pedido,
        items: [item1],
        payments: [pagto1],
    };
    return grupoPedido;
}
function buildGroupOrder3() {
    const pedido = {
        client_id: "CLI002",
        order_id: "241217AB1A",
        client_name: "CONCEICAO",
        creation_date: "2024-12-17T17:10:00.000Z",
        total_value: 40.0,
        record_type: "ORDER",
    };
    const item1 = {
        client_id: "CLI002",
        order_id: "241217AB1A",
        item_id: "IT001",
        product_name: "FONTE ELETRICA",
        quantity: 1,
        price: 40,
        record_type: "ITEM",
    };
    const pagto1 = {
        client_id: "CLI002",
        order_id: "241217AB1A",
        paymnt_id: "PG001",
        paymnt_description: "CARTAO",
        paymnt_value: 40,
        record_type: "PAYMNT",
    };
    const grupoPedido = {
        order: pedido,
        items: [item1],
        payments: [pagto1],
    };
    return grupoPedido;
}
