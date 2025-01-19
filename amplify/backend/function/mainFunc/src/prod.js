"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testQueryProdNamesByNameCache = exports.testMemory = exports.testQueryProdNamesByName = exports.queryProdNamesByName = exports.scanProds = exports.queryProds = exports.readProd = exports.upsertProds = exports.createProds = exports.updateProdTST = exports.putProdTST = exports.getProdTST = exports.getProd = exports.createProd = exports.testCmd = void 0;
const ddb_repository_1 = require("./ddb-repository");
const ddb_utils_1 = require("./ddb-utils");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const simple_db_cache_1 = require("./simple-db-cache");
async function testCmd() {
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: "us-east-2" });
    const params = {
        TableName: "cadastro-dev",
    };
    try {
        const ddbResult = await clientDDB.send(new client_dynamodb_1.QueryCommand(params));
        console.log("Query result:", ddbResult);
    }
    catch (err) {
        console.error("Erro na Query:", err);
    }
}
exports.testCmd = testCmd;
async function createProd() {
    const prod = {
        prod_id: "RL001",
        name: "RELOGIO DE PULSO",
        price: 80.0,
    };
    const ddbProd = {
        pk: { S: prod.prod_id },
        sk: { S: "PRODUCT" },
        name: { S: prod.name },
        price: { N: prod.price.toString() },
    };
    const params = {
        TableName: "cadastro-dev",
        Item: ddbProd,
    };
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: "us-east-2" });
    try {
        const ddbResult = await clientDDB.send(new client_dynamodb_1.PutItemCommand(params));
        console.log("Item inserido com sucesso:", ddbResult);
    }
    catch (err) {
        console.error("Erro ao inserir item:", err);
    }
}
exports.createProd = createProd;
async function getProd() {
    const params = {
        TableName: "cadastro-dev",
        Key: {
            pk: { S: "RL001" },
            sk: { S: "PRODUCT" },
        },
    };
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: "us-east-2" });
    try {
        const ddbResult = await clientDDB.send(new client_dynamodb_1.GetItemCommand(params));
        console.log("Item lido com sucesso:", ddbResult);
    }
    catch (err) {
        console.error("Erro ao inserir item:", err);
    }
}
exports.getProd = getProd;
async function getProdTST() {
    const params = {
        TableName: "cadastro-dev",
        Key: {
            pk: { S: "RLTST" },
            sk: { S: "PRODUCT" },
        },
        ProjectionExpression: "#tipoitem",
        ExpressionAttributeNames: { "#tipoitem": "tipo-item" },
    };
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: "us-east-2" });
    try {
        const ddbResult = await clientDDB.send(new client_dynamodb_1.GetItemCommand(params));
        console.log("Item lido com sucesso:", ddbResult);
    }
    catch (err) {
        console.error("Erro ao inserir item:", err);
    }
}
exports.getProdTST = getProdTST;
async function putProdTST() {
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: "us-east-2" });
    const mostrarItem = async (pk, sk) => {
        const params = {
            TableName: "cadastro-dev",
            Key: {
                pk: { S: pk },
                sk: { S: sk },
            },
        };
        const ddbResult = await clientDDB.send(new client_dynamodb_1.GetItemCommand(params));
        console.log("Registro apos o PutItem: ", ddbResult.Item);
    };
    // Dados primeira execucao
    console.log("--EXECUCAO 1--");
    const prodExec1 = {
        prod_id: "PV345",
        name: "PLACA DE VIDEO",
        price: 120.0,
        creation_date: "24/12/2024",
    };
    const ddbProd1 = {
        pk: { S: prodExec1.prod_id },
        sk: { S: "PRODUCT" },
        name: { S: prodExec1.name },
        price: { N: prodExec1.price.toString() },
        creation_date: { S: prodExec1.creation_date },
    };
    const params1 = {
        TableName: "cadastro-dev",
        Item: ddbProd1,
        ReturnValues: "ALL_OLD",
    };
    const ddbResult1 = await clientDDB.send(new client_dynamodb_1.PutItemCommand(params1));
    console.log("Registro antes do PutItem:", ddbResult1.Attributes);
    await mostrarItem("PV345", "PRODUCT");
    // Dados segunda execucao
    console.log("--EXECUCAO 2--");
    const prodExec2 = {
        prod_id: "PV345",
        name: "PLACA DE VIDEO",
        price: 121.0,
    };
    const ddbProd2 = {
        pk: { S: prodExec2.prod_id },
        sk: { S: "PRODUCT" },
        name: { S: prodExec2.name },
        price: { N: prodExec2.price.toString() },
    };
    const params2 = {
        TableName: "cadastro-dev",
        Item: ddbProd2,
        ReturnValues: "ALL_OLD",
    };
    const ddbResult2 = await clientDDB.send(new client_dynamodb_1.PutItemCommand(params2));
    console.log("Registro antes do PutItem: ", ddbResult2.Attributes);
    await mostrarItem("PV345", "PRODUCT");
}
exports.putProdTST = putProdTST;
async function updateProdTST() {
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: "us-east-2" });
    const mostrarItem = async (pk, sk) => {
        const params = {
            TableName: "cadastro-dev",
            Key: {
                pk: { S: pk },
                sk: { S: sk },
            },
        };
        const ddbResult = await clientDDB.send(new client_dynamodb_1.GetItemCommand(params));
        console.log("Registro apos o UpdateItem: ", ddbResult.Item);
    };
    // Dados primeira execucao
    console.log("--EXECUCAO 1--");
    const prodExec1 = {
        prod_id: "PV345",
        name: "PLACA DE VIDEO",
        price: 120.0,
        creation_date: "24/12/2024",
    };
    const ddbProd1 = {
        pk: { S: prodExec1.prod_id },
        sk: { S: "PRODUCT" },
        name: { S: prodExec1.name },
        price: { N: prodExec1.price.toString() },
        creation_date: { S: prodExec1.creation_date },
    };
    const params1 = {
        TableName: "cadastro-dev",
        Key: { pk: ddbProd1.pk, sk: ddbProd1.sk },
        UpdateExpression: "SET nome = :nome, preco = :preco, dataCriacao = :dataCriacao",
        ExpressionAttributeValues: {
            ":nome": ddbProd1.name,
            ":preco": ddbProd1.price,
            ":dataCriacao": ddbProd1.creation_date,
        },
        ReturnValues: "ALL_OLD",
    };
    const ddbResult1 = await clientDDB.send(new client_dynamodb_1.UpdateItemCommand(params1));
    console.log("Registro antes do UpdateItem:", ddbResult1.Attributes);
    await mostrarItem("PV345", "PRODUCT");
    // Dados segunda execucao
    console.log("--EXECUCAO 2--");
    const prodExec2 = {
        prod_id: "PV345",
        name: "PLACA DE VIDEO",
        price: 121.0,
    };
    const ddbProd2 = {
        pk: { S: prodExec2.prod_id },
        sk: { S: "PRODUCT" },
        name: { S: prodExec2.name },
        price: { N: prodExec2.price.toString() },
    };
    const params2 = {
        TableName: "cadastro-dev",
        Key: { pk: ddbProd2.pk, sk: ddbProd2.sk },
        UpdateExpression: "SET nome = :nome, preco = :preco",
        ExpressionAttributeValues: {
            ":nome": ddbProd2.name,
            ":preco": ddbProd2.price,
        },
        ReturnValues: "ALL_OLD",
    };
    const ddbResult2 = await clientDDB.send(new client_dynamodb_1.UpdateItemCommand(params2));
    console.log("Registro antes do UpdateItem: ", ddbResult2.Attributes);
    await mostrarItem("PV345", "PRODUCT");
}
exports.updateProdTST = updateProdTST;
async function createProds() {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const prod1 = buildProd1();
    await cadRep.putDDBItem(prod1.prod_id, "PRODUCT", prod1);
    const prod2 = buildProd2();
    await cadRep.putDDBItem(prod2.prod_id, "PRODUCT", prod2);
    console.log("Registros criados com putItem!");
}
exports.createProds = createProds;
async function upsertProds() {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const prod1 = buildProd1();
    await cadRep.upsertDDBItem(prod1.prod_id, "PRODUCT", prod1);
    const prod2 = buildProd2();
    await cadRep.upsertDDBItem(prod2.prod_id, "PRODUCT", prod2);
    console.log("Registros criados com updateItem!");
}
exports.upsertProds = upsertProds;
async function readProd() {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const prod = await cadRep.getDDBItem("RL001", "PRODUCT");
    console.log("Produto lido:", prod.name);
}
exports.readProd = readProd;
async function queryProds() {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const indexInfo = {
        indexName: "sk-pk-index",
        pkFieldName: "sk",
        skFieldName: "pk",
    };
    const queryOptions = { indexInfo };
    const prods = await cadRep.queryDDBItems("PRODUCT", queryOptions);
    console.log("Produtos:", prods);
}
exports.queryProds = queryProds;
async function scanProds() {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const scanFilter = {
        filterExpression: "sk = :sk",
        expressionAttributeValues: { ":sk": { S: "PRODUCT" } },
    };
    const scanOptions = { scanFilter };
    const prods = await cadRep.scanDDBItems(scanOptions);
    console.log("Produtos:", prods);
}
exports.scanProds = scanProds;
function buildProd1() {
    const prod1 = {
        prod_id: "RL001",
        name: "RELOGIO DE PULSO",
        price: 80,
        creation_date: "2024-11-02T00:25:34.795Z",
        warehouse: { name: "CD-SP", qty: 23 },
    };
    return prod1;
}
function buildProd2() {
    const prod2 = {
        prod_id: "PV345",
        name: "PLACA DE VIDEO",
        price: 120,
        creation_date: "2024-11-02T00:25:34.795Z",
    };
    return prod2;
}
async function queryProdNamesByName(nameStart) {
    const cadRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const indexInfo = {
        indexName: "sk-name-index",
        pkFieldName: "sk",
        skFieldName: "#name",
    };
    const skFilter = {
        skBeginsWith: nameStart,
    };
    const queryOptions = { skFilter, indexInfo };
    const prods = await cadRep.queryDDBItems("PRODUCT", queryOptions);
    const prodNames = prods.map((prod) => {
        return { prod_id: prod.prod_id, name: prod.name };
    });
    console.log(`Products by name (${nameStart}):`, prodNames);
    return prodNames;
}
exports.queryProdNamesByName = queryProdNamesByName;
async function testQueryProdNamesByName() {
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
exports.testQueryProdNamesByName = testQueryProdNamesByName;
async function testMemory() {
    const inicial = process.memoryUsage();
    //console.log(inicial);
    const prods = (await queryProdNamesByName("")).map((prod) => {
        return {
            prod_id: prod.prod_id,
            name: prod.name +
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
    for (let i = 1; i < 2000; i++)
        alocMem = [...alocMem, ...prods];
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
exports.testMemory = testMemory;
async function testQueryProdNamesByNameCache() {
    const prodsCache = simple_db_cache_1.ProductNamesCache.getInstance();
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
exports.testQueryProdNamesByNameCache = testQueryProdNamesByNameCache;
