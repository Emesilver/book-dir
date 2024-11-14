"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPaymentTypesByName = queryPaymentTypesByName;
const ddb_repository_1 = require("./ddb-repository");
const ddb_utils_1 = require("./ddb-utils");
async function queryPaymentTypesByName() {
    const cadRep = new ddb_repository_1.DDBRepository('cadastro-dev', ddb_utils_1.DDBClient.client());
    const indexInfo = {
        indexName: 'sk-nome-index',
        pkFieldName: 'sk',
        skFieldName: 'nome'
    };
    const skFilter = {
        skBeginsWith: 'CARTAO'
    };
    const queryOptions = { indexInfo, skFilter };
    try {
        const paymentTypes = await cadRep.queryDDBItems("TIPO_PAGAMENTO", queryOptions);
        console.log('Tipos de pagamentos:', paymentTypes);
    }
    catch (error) {
        console.log('error:', error);
    }
}
