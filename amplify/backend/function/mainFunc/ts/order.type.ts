export type Order = {
	client_id: string;
	order_id: string;
	client_name: string;
	creation_date: string;
	total_value: number;
	record_type: 'ORDER';
}

export type OrderItem = {
	client_id: string;
	order_id: string;
	item_id: string;
	product_name: string;
	quantity: number;
	price: number;
	record_type: 'ITEM';
}

export type OrderPayment = {
	client_id: string;
	order_id: string;
	paymnt_id: string;
	paymnt_description: string;
	paymnt_value: number;
	paymnt_date?: string;
	record_type: 'PAYMNT';
}

export type OrderGroup = {
	order: Order;
	items: OrderItem[];
	payments: OrderPayment[];
}