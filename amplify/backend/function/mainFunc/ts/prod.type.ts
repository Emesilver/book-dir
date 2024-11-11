export type Produto = {
  codigo: string;
  nome: string;
  preco: number;
  dataCriacao?: string;
  armazem?: {
    nome: string,
    qtde: number,
  }
}