import { DDBRepository } from "./ddb-repository";
import { DDBClient } from "./ddb-utils";
import { GrupoPedido, Pedido, PedidoItem, PedidoPagto } from "./order.type";

export async function seedPedidos() {
  await saveGroupOrder( buildGroupOrder1());
  await saveGroupOrder( buildGroupOrder2());
  await saveGroupOrder( buildGroupOrder3());
}

async function saveGroupOrder({pedido, items, pagtos}: GrupoPedido) {
  const seedPedido = new DDBRepository('cadastro-dev', DDBClient.client());
  const pk = pedido.codigo_cliente;
  
  // Gravar o cabecalho do pedido
  const skPedido = `PED#${pedido.id_pedido}`;
  console.log('Gravando pedido ', skPedido)
  await seedPedido.putDDBItem(pk, skPedido, pedido)

  // Gravar os items em paralelo
  await Promise.all(items.map(async (item) => {
    const skItem = `${skPedido}#ITEM#${item.id_item}`;
    return seedPedido.putDDBItem(pk, skItem, item)
  }));

  // Gravar os pagamentos em paralelo
  await Promise.all(pagtos.map(async (pagto) => {
    const skPagto = `${skPedido}#PAGTO#${pagto.id_pagto}`;
    return seedPedido.putDDBItem(pk, skPagto, pagto)
  }));
}

function buildGroupOrder1() {
  const pedido: Pedido = {
    codigo_cliente: "CLI001",
    id_pedido: "ABC0A",
    nome_cliente: "EMERSON",
    data_criacao: "2024-01-23T11:23:01.000Z",
    valor_total: 120.00,
    tipo_registro: "PEDIDO"
  }
  const item1: PedidoItem = {
    codigo_cliente: "CLI001",
    id_pedido: "ABC0A",
    id_item: "IT001",
    nome_produto: "PLACA DE VIDEO",
    quantidade: 1,
    preco: 80,
    tipo_registro: "ITEM"
  }
  const item2: PedidoItem = {
    codigo_cliente: "CLI001",
    id_pedido: "ABC0A",
    id_item: "IT002",
    nome_produto: "PROCESSADOR",
    quantidade: 2,
    preco: 40,
    tipo_registro: "ITEM"
  }
  const pagto1: PedidoPagto = {
    codigo_cliente: "CLI001",
    id_pedido: "ABC0A",
    id_pagto: "PG001",
    descricao_pagto: "CARTAO",
    valor: 60,
    tipo_registro: "PAGTO"
  }
  const pagto2: PedidoPagto = {
    codigo_cliente: "CLI001",
    id_pedido: "ABC0A",
    id_pagto: "PG002",
    descricao_pagto: "CARTAO",
    valor: 60,
    tipo_registro: "PAGTO"
  }
  const grupoPedido: GrupoPedido = {
    pedido,
    items: [item1, item2],
    pagtos: [pagto1, pagto2]
  }
  return grupoPedido;
}

function buildGroupOrder2() {
  const pedido: Pedido = {
    codigo_cliente: "CLI001",
    id_pedido: "SDF45",
    nome_cliente: "EMERSON",
    data_criacao: "2024-01-23T11:24:01.000Z",
    valor_total: 70.00,
    tipo_registro: "PEDIDO"
  }
  const item1: PedidoItem = {
    codigo_cliente: "CLI001",
    id_pedido: "SDF45",
    id_item: "IT001",
    nome_produto: "FONTE ELETRICA",
    quantidade: 1,
    preco: 70,
    tipo_registro: "ITEM"
  }
  const pagto1: PedidoPagto = {
    codigo_cliente: "CLI001",
    id_pedido: "SDF45",
    id_pagto: "PG001",
    descricao_pagto: "CARTAO",
    valor: 70,
    tipo_registro: "PAGTO"
  }
  const grupoPedido: GrupoPedido = {
    pedido,
    items: [item1],
    pagtos: [pagto1]
  }
  return grupoPedido;
}

function buildGroupOrder3() {
  const pedido: Pedido = {
    codigo_cliente: "CLI002",
    id_pedido: "G34DF",
    nome_cliente: "CONCEICAO",
    data_criacao: "2024-01-17T11:24:01.000Z",
    valor_total: 40.00,
    tipo_registro: "PEDIDO"
  }
  const item1: PedidoItem = {
    codigo_cliente: "CLI002",
    id_pedido: "G34DF",
    id_item: "IT001",
    nome_produto: "FONTE ELETRICA",
    quantidade: 1,
    preco: 40,
    tipo_registro: "ITEM"
  }
  const pagto1: PedidoPagto = {
    codigo_cliente: "CLI002",
    id_pedido: "G34DF",
    id_pagto: "PG001",
    descricao_pagto: "CARTAO",
    valor: 40,
    tipo_registro: "PAGTO"
  }
  const grupoPedido: GrupoPedido = {
    pedido,
    items: [item1],
    pagtos: [pagto1]
  }
  return grupoPedido;
}