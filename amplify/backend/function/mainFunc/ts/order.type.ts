export type Pedido = {
	codigo_cliente: string;
	id_pedido: string;
	nome_cliente: string;
	data_criacao: string;
	valor_total: number;
	tipo_registro: 'PEDIDO';
}

export type PedidoItem = {
	codigo_cliente: string;
	id_pedido: string;
	id_item: string;
	nome_produto: string;
	quantidade: number;
	preco: number;
	tipo_registro: 'ITEM';
}

export type PedidoPagto = {
	codigo_cliente: string;
	id_pedido: string;
	id_pagto: string;
	descricao_pagto: string;
	valor: number;
	data_pagto?: string;
	tipo_registro: 'PAGTO';
}

export type GrupoPedido = {
	pedido: Pedido;
	items: PedidoItem[];
	pagtos: PedidoPagto[];
}