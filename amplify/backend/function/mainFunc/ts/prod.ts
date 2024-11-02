import { CadastroRepository } from "./cadastro.rep";
import { DDBClient } from "./ddb-utils";
import { Produto } from "./prod.type";
import { 
  AttributeValue, DynamoDBClient,
  PutItemCommandInput, PutItemCommand,
  UpdateItemCommandInput, UpdateItemCommand,
  GetItemCommandInput, GetItemCommand 
} from '@aws-sdk/client-dynamodb'

export async function createProd() {
  const prod: Produto = {
    codigo: "RL001",
    nome: "RELOGIO DE PULSO",
    preco: 80.00
  }
  const ddbProd: Record<string, AttributeValue> = {
    pk: {S: prod.codigo},
    sk: {S: "PRODUTO"},
    nome: {S: prod.nome},
    preco: {N: prod.preco.toString()}
  }
  const params: PutItemCommandInput = {
    TableName: "cadastro-dev",
    Item: ddbProd
  }
  const clientDDB = new DynamoDBClient({region: 'us-east-2'});
  try {
    const ddbResult = await clientDDB.send(new PutItemCommand(params));
    console.log("Item inserido com sucesso:", ddbResult);
  } catch (err) {
    console.error("Erro ao inserir item:", err);
  }
}

export async function getProd() {
  const params: GetItemCommandInput = {
    TableName: "cadastro-dev",
    Key: {
      pk: {S: "RL001"},
      sk: {S: "PRODUTO"},
    }
  }
  const clientDDB = new DynamoDBClient({region: 'us-east-2'});
  try {
    const ddbResult = await clientDDB.send(new GetItemCommand(params));
    console.log("Item lido com sucesso:", ddbResult);
  } catch (err) {
    console.error("Erro ao inserir item:", err);
  }
}

export async function getProdTST() {
  const params: GetItemCommandInput = {
    TableName: "cadastro-dev",
    Key: {
      pk: {S: "RLTST"},
      sk: {S: "PRODUTO"},
    },
    ProjectionExpression: '#tipoitem',
    ExpressionAttributeNames: {'#tipoitem': 'tipo-item'}
  }
  const clientDDB = new DynamoDBClient({region: 'us-east-2'});
  try {
    const ddbResult = await clientDDB.send(new GetItemCommand(params));
    console.log("Item lido com sucesso:", ddbResult);
  } catch (err) {
    console.error("Erro ao inserir item:", err);
  }
}

export async function putProdTST() {
  const clientDDB = new DynamoDBClient({region: 'us-east-2'});
  const mostrarItem = async (pk: string, sk: string) => {
    const params: GetItemCommandInput = {
      TableName: "cadastro-dev",
      Key: {
        pk: {S: pk},
        sk: {S: sk},
      }
    }
    const ddbResult = await clientDDB.send(new GetItemCommand(params));
    console.log('Registro apos o PutItem: ', ddbResult.Item);
  }

  // Dados primeira execucao
  console.log('--EXECUCAO 1--')
  const prodExec1: Produto = {
    codigo: "PV345",
    nome: "PLACA DE VIDEO",
    preco: 120.00,
    dataCriacao: '24/12/2024',
  }
  const ddbProd1: Record<string, AttributeValue> = {
    pk: {S: prodExec1.codigo},
    sk: {S: "PRODUTO"},
    nome: {S: prodExec1.nome},
    preco: {N: prodExec1.preco.toString()},
    dataCriacao: {S: prodExec1.dataCriacao},
  }
  const params1: PutItemCommandInput = {
    TableName: "cadastro-dev",
    Item: ddbProd1,
    ReturnValues: 'ALL_OLD',
  }
  const ddbResult1 = await clientDDB.send(new PutItemCommand(params1));
  console.log('Registro antes do PutItem:', ddbResult1.Attributes);
  await mostrarItem("PV345", "PRODUTO");

  // Dados segunda execucao
  console.log('--EXECUCAO 2--')
  const prodExec2: Produto = {
    codigo: "PV345",
    nome: "PLACA DE VIDEO",
    preco: 121.00,
  }
  const ddbProd2: Record<string, AttributeValue> = {
    pk: {S: prodExec2.codigo},
    sk: {S: "PRODUTO"},
    nome: {S: prodExec2.nome},
    preco: {N: prodExec2.preco.toString()},
  }
  const params2: PutItemCommandInput = {
    TableName: "cadastro-dev",
    Item: ddbProd2,
    ReturnValues: 'ALL_OLD',
  }
  const ddbResult2 = await clientDDB.send(new PutItemCommand(params2));
  console.log('Registro antes do PutItem: ', ddbResult2.Attributes);
  await mostrarItem("PV345", "PRODUTO");
}
  
export async function updateProdTST() {
  const clientDDB = new DynamoDBClient({region: 'us-east-2'});
  const mostrarItem = async (pk: string, sk: string) => {
    const params: GetItemCommandInput = {
      TableName: "cadastro-dev",
      Key: {
        pk: {S: pk},
        sk: {S: sk},
      }
    }
    const ddbResult = await clientDDB.send(new GetItemCommand(params));
    console.log('Registro apos o UpdateItem: ', ddbResult.Item);
  }

  // Dados primeira execucao
  console.log('--EXECUCAO 1--')
  const prodExec1: Produto = {
    codigo: "PV345",
    nome: "PLACA DE VIDEO",
    preco: 120.00,
    dataCriacao: '24/12/2024',
  }
  const ddbProd1: Record<string, AttributeValue> = {
    pk: {S: prodExec1.codigo},
    sk: {S: "PRODUTO"},
    nome: {S: prodExec1.nome},
    preco: {N: prodExec1.preco.toString()},
    dataCriacao: {S: prodExec1.dataCriacao},
  }
  const params1: UpdateItemCommandInput = {
    TableName: "cadastro-dev",
    Key: {pk: ddbProd1.pk, sk: ddbProd1.sk},
    UpdateExpression: 'SET nome = :nome, preco = :preco, dataCriacao = :dataCriacao',
    ExpressionAttributeValues: {
      ':nome': ddbProd1.nome,
      ':preco': ddbProd1.preco,
      ':dataCriacao': ddbProd1.dataCriacao
    },
    ReturnValues: 'ALL_OLD',
  }
  const ddbResult1 = await clientDDB.send(new UpdateItemCommand(params1));
  console.log('Registro antes do UpdateItem:', ddbResult1.Attributes);
  await mostrarItem("PV345", "PRODUTO");

  // Dados segunda execucao
  console.log('--EXECUCAO 2--')
  const prodExec2: Produto = {
    codigo: "PV345",
    nome: "PLACA DE VIDEO",
    preco: 121.00,
  }
  const ddbProd2: Record<string, AttributeValue> = {
    pk: {S: prodExec2.codigo},
    sk: {S: "PRODUTO"},
    nome: {S: prodExec2.nome},
    preco: {N: prodExec2.preco.toString()},
  }
  const params2: UpdateItemCommandInput = {
    TableName: "cadastro-dev",
    Key: {pk: ddbProd2.pk, sk: ddbProd2.sk},
    UpdateExpression: 'SET nome = :nome, preco = :preco',
    ExpressionAttributeValues: {
      ':nome': ddbProd2.nome,
      ':preco': ddbProd2.preco
    },
    ReturnValues: 'ALL_OLD',
  }
  const ddbResult2 = await clientDDB.send(new UpdateItemCommand(params2));
  console.log('Registro antes do UpdateItem: ', ddbResult2.Attributes);
  await mostrarItem("PV345", "PRODUTO");
}

export async function createProds() {
  const cadRep = new CadastroRepository('cadastro-dev', DDBClient.client());
  const prod1 = buildProd1();
  await cadRep.putDDBItem(prod1.codigo, "PRODUTO", prod1)
  const prod2 = buildProd2();
  await cadRep.putDDBItem(prod2.codigo, "PRODUTO", prod2)
  console.log('Registros criados com putItem!')
}

export async function upsertProds() {
  const cadRep = new CadastroRepository('cadastro-dev', DDBClient.client());
  const prod1 = buildProd1();
  await cadRep.upsertDDBItem(prod1.codigo, "PRODUTO", prod1)
  const prod2 = buildProd2();
  await cadRep.upsertDDBItem(prod2.codigo, "PRODUTO", prod2)
  console.log('Registros criados com updateItem!')
}

function buildProd1() {
  const prod1: Produto = {
    codigo: "RL001",
    nome: "RELOGIO DE PULSO",
    preco: 80,
    dataCriacao: '2024-11-02T00:25:34.795Z',
    armazem: {nome: 'CD-SP', qtde: 23}
  }
  return prod1;
}

function buildProd2() {
  const prod2: Produto = {
    codigo: "PV345",
    nome: "PLACA DE VIDEO",
    preco: 120,
    dataCriacao: '2024-11-02T00:25:34.795Z',
  }
  return prod2;
}