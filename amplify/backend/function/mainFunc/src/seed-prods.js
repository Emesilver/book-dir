"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProds = void 0;
const ddb_repository_1 = require("./ddb-repository");
const ddb_utils_1 = require("./ddb-utils");
async function seedProds() {
    const seedProdsRep = new ddb_repository_1.DDBRepository("cadastro-dev", ddb_utils_1.DDBClient.client());
    const prodNames = getProdNames();
    for (const index of prodNames.keys()) {
        const prod = {
            codigo: "PR" + ("000" + index + 1).slice(-3),
            nome: prodNames[index],
            preco: 10,
            dataCriacao: "2025-01-04T12:25:34.795Z",
            armazem: { nome: "CD-SP", qtde: 5 },
        };
        await seedProdsRep.putDDBItem(prod.codigo, 'PRODUTO', prod);
        console.log('Added ' + prod.nome);
    }
}
exports.seedProds = seedProds;
function getProdNames() {
    return [
        "HEADSET GAMER PROFISSIONAL 7.1",
        "MOUSE GAMER RGB PERSONALIZAVEL",
        "TECLADO MECANICO GAMING RGB",
        "JOYSTICK ARCADE RETRO",
        "MONITOR GAMER CURVO 144HZ",
        "CONSOLE PORTATIL RETRO",
        "PLACA DE VIDEO RTX 4090",
        "PROCESSADOR INTEL CORE I9",
        "MEMORIA RAM DDR5 64GB",
        "SSD NVME 2TB",
    ];
}
