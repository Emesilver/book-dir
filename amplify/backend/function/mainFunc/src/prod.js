"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProd = createProd;
exports.getProd = getProd;
exports.getProdTST = getProdTST;
exports.putProdTST = putProdTST;
exports.updateProdTST = updateProdTST;
exports.createProds = createProds;
exports.upsertProds = upsertProds;
exports.readProd = readProd;
const cadastro_rep_1 = require("./cadastro.rep");
const ddb_utils_1 = require("./ddb-utils");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
async function createProd() {
    const prod = {
        codigo: "RL001",
        nome: "RELOGIO DE PULSO",
        preco: 80.00
    };
    const ddbProd = {
        pk: { S: prod.codigo },
        sk: { S: "PRODUTO" },
        nome: { S: prod.nome },
        preco: { N: prod.preco.toString() }
    };
    const params = {
        TableName: "cadastro-dev",
        Item: ddbProd
    };
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
    try {
        const ddbResult = await clientDDB.send(new client_dynamodb_1.PutItemCommand(params));
        console.log("Item inserido com sucesso:", ddbResult);
    }
    catch (err) {
        console.error("Erro ao inserir item:", err);
    }
}
async function getProd() {
    const params = {
        TableName: "cadastro-dev",
        Key: {
            pk: { S: "RL001" },
            sk: { S: "PRODUTO" },
        }
    };
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
    try {
        const ddbResult = await clientDDB.send(new client_dynamodb_1.GetItemCommand(params));
        console.log("Item lido com sucesso:", ddbResult);
    }
    catch (err) {
        console.error("Erro ao inserir item:", err);
    }
}
async function getProdTST() {
    const params = {
        TableName: "cadastro-dev",
        Key: {
            pk: { S: "RLTST" },
            sk: { S: "PRODUTO" },
        },
        ProjectionExpression: '#tipoitem',
        ExpressionAttributeNames: { '#tipoitem': 'tipo-item' }
    };
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
    try {
        const ddbResult = await clientDDB.send(new client_dynamodb_1.GetItemCommand(params));
        console.log("Item lido com sucesso:", ddbResult);
    }
    catch (err) {
        console.error("Erro ao inserir item:", err);
    }
}
async function putProdTST() {
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
    const mostrarItem = async (pk, sk) => {
        const params = {
            TableName: "cadastro-dev",
            Key: {
                pk: { S: pk },
                sk: { S: sk },
            }
        };
        const ddbResult = await clientDDB.send(new client_dynamodb_1.GetItemCommand(params));
        console.log('Registro apos o PutItem: ', ddbResult.Item);
    };
    // Dados primeira execucao
    console.log('--EXECUCAO 1--');
    const prodExec1 = {
        codigo: "PV345",
        nome: "PLACA DE VIDEO",
        preco: 120.00,
        dataCriacao: '24/12/2024',
    };
    const ddbProd1 = {
        pk: { S: prodExec1.codigo },
        sk: { S: "PRODUTO" },
        nome: { S: prodExec1.nome },
        preco: { N: prodExec1.preco.toString() },
        dataCriacao: { S: prodExec1.dataCriacao },
    };
    const params1 = {
        TableName: "cadastro-dev",
        Item: ddbProd1,
        ReturnValues: 'ALL_OLD',
    };
    const ddbResult1 = await clientDDB.send(new client_dynamodb_1.PutItemCommand(params1));
    console.log('Registro antes do PutItem:', ddbResult1.Attributes);
    await mostrarItem("PV345", "PRODUTO");
    // Dados segunda execucao
    console.log('--EXECUCAO 2--');
    const prodExec2 = {
        codigo: "PV345",
        nome: "PLACA DE VIDEO",
        preco: 121.00,
    };
    const ddbProd2 = {
        pk: { S: prodExec2.codigo },
        sk: { S: "PRODUTO" },
        nome: { S: prodExec2.nome },
        preco: { N: prodExec2.preco.toString() },
    };
    const params2 = {
        TableName: "cadastro-dev",
        Item: ddbProd2,
        ReturnValues: 'ALL_OLD',
    };
    const ddbResult2 = await clientDDB.send(new client_dynamodb_1.PutItemCommand(params2));
    console.log('Registro antes do PutItem: ', ddbResult2.Attributes);
    await mostrarItem("PV345", "PRODUTO");
}
async function updateProdTST() {
    const clientDDB = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
    const mostrarItem = async (pk, sk) => {
        const params = {
            TableName: "cadastro-dev",
            Key: {
                pk: { S: pk },
                sk: { S: sk },
            }
        };
        const ddbResult = await clientDDB.send(new client_dynamodb_1.GetItemCommand(params));
        console.log('Registro apos o UpdateItem: ', ddbResult.Item);
    };
    // Dados primeira execucao
    console.log('--EXECUCAO 1--');
    const prodExec1 = {
        codigo: "PV345",
        nome: "PLACA DE VIDEO",
        preco: 120.00,
        dataCriacao: '24/12/2024',
    };
    const ddbProd1 = {
        pk: { S: prodExec1.codigo },
        sk: { S: "PRODUTO" },
        nome: { S: prodExec1.nome },
        preco: { N: prodExec1.preco.toString() },
        dataCriacao: { S: prodExec1.dataCriacao },
    };
    const params1 = {
        TableName: "cadastro-dev",
        Key: { pk: ddbProd1.pk, sk: ddbProd1.sk },
        UpdateExpression: 'SET nome = :nome, preco = :preco, dataCriacao = :dataCriacao',
        ExpressionAttributeValues: {
            ':nome': ddbProd1.nome,
            ':preco': ddbProd1.preco,
            ':dataCriacao': ddbProd1.dataCriacao
        },
        ReturnValues: 'ALL_OLD',
    };
    const ddbResult1 = await clientDDB.send(new client_dynamodb_1.UpdateItemCommand(params1));
    console.log('Registro antes do UpdateItem:', ddbResult1.Attributes);
    await mostrarItem("PV345", "PRODUTO");
    // Dados segunda execucao
    console.log('--EXECUCAO 2--');
    const prodExec2 = {
        codigo: "PV345",
        nome: "PLACA DE VIDEO",
        preco: 121.00,
    };
    const ddbProd2 = {
        pk: { S: prodExec2.codigo },
        sk: { S: "PRODUTO" },
        nome: { S: prodExec2.nome },
        preco: { N: prodExec2.preco.toString() },
    };
    const params2 = {
        TableName: "cadastro-dev",
        Key: { pk: ddbProd2.pk, sk: ddbProd2.sk },
        UpdateExpression: 'SET nome = :nome, preco = :preco',
        ExpressionAttributeValues: {
            ':nome': ddbProd2.nome,
            ':preco': ddbProd2.preco
        },
        ReturnValues: 'ALL_OLD',
    };
    const ddbResult2 = await clientDDB.send(new client_dynamodb_1.UpdateItemCommand(params2));
    console.log('Registro antes do UpdateItem: ', ddbResult2.Attributes);
    await mostrarItem("PV345", "PRODUTO");
}
async function createProds() {
    const cadRep = new cadastro_rep_1.CadastroRepository('cadastro-dev', ddb_utils_1.DDBClient.client());
    const prod1 = buildProd1();
    await cadRep.putDDBItem(prod1.codigo, "PRODUTO", prod1);
    const prod2 = buildProd2();
    await cadRep.putDDBItem(prod2.codigo, "PRODUTO", prod2);
    console.log('Registros criados com putItem!');
}
async function upsertProds() {
    const cadRep = new cadastro_rep_1.CadastroRepository('cadastro-dev', ddb_utils_1.DDBClient.client());
    const prod1 = buildProd1();
    await cadRep.upsertDDBItem(prod1.codigo, "PRODUTO", prod1);
    const prod2 = buildProd2();
    await cadRep.upsertDDBItem(prod2.codigo, "PRODUTO", prod2);
    console.log('Registros criados com updateItem!');
}
async function readProd() {
    const cadRep = new cadastro_rep_1.CadastroRepository('cadastro-dev', ddb_utils_1.DDBClient.client());
    const prod = await cadRep.getDDBItem('RL001', "PRODUTO");
    console.log('Produto lido:', prod.nome);
}
function buildProd1() {
    const prod1 = {
        codigo: "RL001",
        nome: "RELOGIO DE PULSO",
        preco: 80,
        dataCriacao: '2024-11-02T00:25:34.795Z',
        armazem: { nome: 'CD-SP', qtde: 23 }
    };
    return prod1;
}
function buildProd2() {
    const prod2 = {
        codigo: "PV345",
        nome: "PLACA DE VIDEO",
        preco: 120,
        dataCriacao: '2024-11-02T00:25:34.795Z',
    };
    return prod2;
}
