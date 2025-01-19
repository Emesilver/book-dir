import {
  IndexInfo,
  QueryOptions,
  ScanFilter,
  ScanOptions,
  SKFilter,
} from "./ddb";
import { DDBRepository } from "./ddb-repository";
import { DDBClient } from "./ddb-utils";
import { Product } from "./prod.type";
import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommandInput,
  PutItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommand,
  GetItemCommandInput,
  GetItemCommand,
  QueryCommandInput,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { ProductNamesCache } from "./simple-db-cache";

export async function testCmd() {
  const clientDDB = new DynamoDBClient({ region: "us-east-2" });
  const params: QueryCommandInput = {
    TableName: "cadastro-dev",
  };
  try {
    const ddbResult = await clientDDB.send(new QueryCommand(params));
    console.log("Query result:", ddbResult);
  } catch (err) {
    console.error("Erro na Query:", err);
  }
}

export async function createProd() {
  const prod: Product = {
    prod_id: "RL001",
    name: "RELOGIO DE PULSO",
    price: 80.0,
  };
  const ddbProd: Record<string, AttributeValue> = {
    pk: { S: prod.prod_id },
    sk: { S: "PRODUCT" },
    name: { S: prod.name },
    price: { N: prod.price.toString() },
  };
  const params: PutItemCommandInput = {
    TableName: "cadastro-dev",
    Item: ddbProd,
  };
  const clientDDB = new DynamoDBClient({ region: "us-east-2" });
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
      pk: { S: "RL001" },
      sk: { S: "PRODUCT" },
    },
  };
  const clientDDB = new DynamoDBClient({ region: "us-east-2" });
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
      pk: { S: "RLTST" },
      sk: { S: "PRODUCT" },
    },
    ProjectionExpression: "#tipoitem",
    ExpressionAttributeNames: { "#tipoitem": "tipo-item" },
  };
  const clientDDB = new DynamoDBClient({ region: "us-east-2" });
  try {
    const ddbResult = await clientDDB.send(new GetItemCommand(params));
    console.log("Item lido com sucesso:", ddbResult);
  } catch (err) {
    console.error("Erro ao inserir item:", err);
  }
}

export async function putProdTST() {
  const clientDDB = new DynamoDBClient({ region: "us-east-2" });
  const mostrarItem = async (pk: string, sk: string) => {
    const params: GetItemCommandInput = {
      TableName: "cadastro-dev",
      Key: {
        pk: { S: pk },
        sk: { S: sk },
      },
    };
    const ddbResult = await clientDDB.send(new GetItemCommand(params));
    console.log("Registro apos o PutItem: ", ddbResult.Item);
  };

  // Dados primeira execucao
  console.log("--EXECUCAO 1--");
  const prodExec1: Product = {
    prod_id: "PV345",
    name: "PLACA DE VIDEO",
    price: 120.0,
    creation_date: "24/12/2024",
  };
  const ddbProd1: Record<string, AttributeValue> = {
    pk: { S: prodExec1.prod_id },
    sk: { S: "PRODUCT" },
    name: { S: prodExec1.name },
    price: { N: prodExec1.price.toString() },
    creation_date: { S: prodExec1.creation_date },
  };
  const params1: PutItemCommandInput = {
    TableName: "cadastro-dev",
    Item: ddbProd1,
    ReturnValues: "ALL_OLD",
  };
  const ddbResult1 = await clientDDB.send(new PutItemCommand(params1));
  console.log("Registro antes do PutItem:", ddbResult1.Attributes);
  await mostrarItem("PV345", "PRODUCT");

  // Dados segunda execucao
  console.log("--EXECUCAO 2--");
  const prodExec2: Product = {
    prod_id: "PV345",
    name: "PLACA DE VIDEO",
    price: 121.0,
  };
  const ddbProd2: Record<string, AttributeValue> = {
    pk: { S: prodExec2.prod_id },
    sk: { S: "PRODUCT" },
    name: { S: prodExec2.name },
    price: { N: prodExec2.price.toString() },
  };
  const params2: PutItemCommandInput = {
    TableName: "cadastro-dev",
    Item: ddbProd2,
    ReturnValues: "ALL_OLD",
  };
  const ddbResult2 = await clientDDB.send(new PutItemCommand(params2));
  console.log("Registro antes do PutItem: ", ddbResult2.Attributes);
  await mostrarItem("PV345", "PRODUCT");
}

export async function updateProdTST() {
  const clientDDB = new DynamoDBClient({ region: "us-east-2" });
  const mostrarItem = async (pk: string, sk: string) => {
    const params: GetItemCommandInput = {
      TableName: "cadastro-dev",
      Key: {
        pk: { S: pk },
        sk: { S: sk },
      },
    };
    const ddbResult = await clientDDB.send(new GetItemCommand(params));
    console.log("Registro apos o UpdateItem: ", ddbResult.Item);
  };

  // Dados primeira execucao
  console.log("--EXECUCAO 1--");
  const prodExec1: Product = {
    prod_id: "PV345",
    name: "PLACA DE VIDEO",
    price: 120.0,
    creation_date: "24/12/2024",
  };
  const ddbProd1: Record<string, AttributeValue> = {
    pk: { S: prodExec1.prod_id },
    sk: { S: "PRODUCT" },
    name: { S: prodExec1.name },
    price: { N: prodExec1.price.toString() },
    creation_date: { S: prodExec1.creation_date },
  };
  const params1: UpdateItemCommandInput = {
    TableName: "cadastro-dev",
    Key: { pk: ddbProd1.pk, sk: ddbProd1.sk },
    UpdateExpression:
      "SET nome = :nome, preco = :preco, dataCriacao = :dataCriacao",
    ExpressionAttributeValues: {
      ":nome": ddbProd1.name,
      ":preco": ddbProd1.price,
      ":dataCriacao": ddbProd1.creation_date,
    },
    ReturnValues: "ALL_OLD",
  };
  const ddbResult1 = await clientDDB.send(new UpdateItemCommand(params1));
  console.log("Registro antes do UpdateItem:", ddbResult1.Attributes);
  await mostrarItem("PV345", "PRODUCT");

  // Dados segunda execucao
  console.log("--EXECUCAO 2--");
  const prodExec2: Product = {
    prod_id: "PV345",
    name: "PLACA DE VIDEO",
    price: 121.0,
  };
  const ddbProd2: Record<string, AttributeValue> = {
    pk: { S: prodExec2.prod_id },
    sk: { S: "PRODUCT" },
    name: { S: prodExec2.name },
    price: { N: prodExec2.price.toString() },
  };
  const params2: UpdateItemCommandInput = {
    TableName: "cadastro-dev",
    Key: { pk: ddbProd2.pk, sk: ddbProd2.sk },
    UpdateExpression: "SET nome = :nome, preco = :preco",
    ExpressionAttributeValues: {
      ":nome": ddbProd2.name,
      ":preco": ddbProd2.price,
    },
    ReturnValues: "ALL_OLD",
  };
  const ddbResult2 = await clientDDB.send(new UpdateItemCommand(params2));
  console.log("Registro antes do UpdateItem: ", ddbResult2.Attributes);
  await mostrarItem("PV345", "PRODUCT");
}

export async function createProds() {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const prod1 = buildProd1();
  await cadRep.putDDBItem(prod1.prod_id, "PRODUCT", prod1);
  const prod2 = buildProd2();
  await cadRep.putDDBItem(prod2.prod_id, "PRODUCT", prod2);
  console.log("Registros criados com putItem!");
}

export async function upsertProds() {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const prod1 = buildProd1();
  await cadRep.upsertDDBItem(prod1.prod_id, "PRODUCT", prod1);
  const prod2 = buildProd2();
  await cadRep.upsertDDBItem(prod2.prod_id, "PRODUCT", prod2);
  console.log("Registros criados com updateItem!");
}

export async function readProd() {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const prod = await cadRep.getDDBItem<Product>("RL001", "PRODUCT");
  console.log("Produto lido:", prod.name);
}

export async function queryProds() {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const indexInfo: IndexInfo = {
    indexName: "sk-pk-index",
    pkFieldName: "sk",
    skFieldName: "pk",
  };
  const queryOptions: QueryOptions = { indexInfo };
  const prods = await cadRep.queryDDBItems<Product>("PRODUCT", queryOptions);
  console.log("Produtos:", prods);
}

export async function scanProds() {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const scanFilter: ScanFilter = {
    filterExpression: "sk = :sk",
    expressionAttributeValues: { ":sk": { S: "PRODUCT" } },
  };
  const scanOptions: ScanOptions = { scanFilter };
  const prods = await cadRep.scanDDBItems(scanOptions);
  console.log("Produtos:", prods);
}

function buildProd1() {
  const prod1: Product = {
    prod_id: "RL001",
    name: "RELOGIO DE PULSO",
    price: 80,
    creation_date: "2024-11-02T00:25:34.795Z",
    warehouse: { name: "CD-SP", qty: 23 },
  };
  return prod1;
}

function buildProd2() {
  const prod2: Product = {
    prod_id: "PV345",
    name: "PLACA DE VIDEO",
    price: 120,
    creation_date: "2024-11-02T00:25:34.795Z",
  };
  return prod2;
}

export async function queryProdNamesByName(nameStart: string) {
  const cadRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const indexInfo: IndexInfo = {
    indexName: "sk-name-index",
    pkFieldName: "sk",
    skFieldName: "#name",
  };
  const skFilter: SKFilter = {
    skBeginsWith: nameStart,
  };
  const queryOptions: QueryOptions = { skFilter, indexInfo };
  const prods = await cadRep.queryDDBItems<Product>("PRODUCT", queryOptions);
  const prodNames = prods.map((prod) => {
    return { prod_id: prod.prod_id, name: prod.name };
  });
  console.log(`Products by name (${nameStart}):`, prodNames);
  return prodNames;
}

export async function testQueryProdNamesByName() {
  console.time("M call time");
  await queryProdNamesByName("M");
  console.timeEnd("M call time");

  console.time("MO call time");
  await queryProdNamesByName("MO");
  console.timeEnd("MO call time");

  console.time("MOU call time");
  await queryProdNamesByName("MOU");
  console.timeEnd("MOU call time");
}

export async function testMemory() {
  const inicial = process.memoryUsage();
  //console.log(inicial);

  const prods = (await queryProdNamesByName("")).map((prod) => {
    return {
      prod_id: prod.prod_id,
      name:
        prod.name +
        "-" +
        prod.name +
        "-" +
        prod.name +
        prod.name +
        "-" +
        prod.name +
        prod.name +
        "-" +
        prod.name +
        "-" +
        prod.name +
        prod.name +
        "-" +
        prod.name,
    };
  });
  console.log("10 prods length", JSON.stringify(prods).length);

  let alocMem = [];
  for (let i = 1; i < 2000; i++) alocMem = [...alocMem, ...prods];
  console.log("Total prods:", alocMem.length);

  const final = process.memoryUsage();
  console.log(final);
  const result = {
    rss: (final["rss"] - inicial["rss"]) / 1024,
    heapTotal: (final["heapTotal"] - inicial["heapTotal"]) / 1024,
    heapUsed: (final["heapUsed"] - inicial["heapUsed"]) / 1024,
    external: (final["external"] - inicial["external"]) / 1024,
    arrayBuffers: (final["arrayBuffers"] - inicial["arrayBuffers"]) / 1024,
  };
  console.log(result);
}

export async function testQueryProdNamesByNameCache() {
  const prodsCache = ProductNamesCache.getInstance();
  console.time("M call");
  await prodsCache.getItems("M");
  console.timeEnd("M call");
  console.time("MO call");
  await prodsCache.getItems("MO");
  console.timeEnd("MO call");
  console.time("MOU call");
  await prodsCache.getItems("MOU");
  console.timeEnd("MOU call");

}
