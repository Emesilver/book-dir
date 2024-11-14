import { IndexInfo, QueryOptions, SKFilter } from "./ddb";
import { DDBRepository } from "./ddb-repository";
import { DDBClient } from "./ddb-utils";
import { PaymentType } from "./pay-type.type";


export async function queryPaymentTypesByName() {
  const cadRep = new DDBRepository('cadastro-dev', DDBClient.client());
  const indexInfo: IndexInfo = {
    indexName: 'sk-nome-index',
    pkFieldName: 'sk',
    skFieldName: 'nome'
  }
  const skFilter: SKFilter = {
    skBeginsWith: 'CARTAO'      
  }
  const queryOptions: QueryOptions = {indexInfo, skFilter}
  try {
    const paymentTypes = await cadRep.queryDDBItems<PaymentType>("TIPO_PAGAMENTO", queryOptions)
    console.log('Tipos de pagamentos:', paymentTypes)
  } catch (error) {
      console.log('error:', error)
  }
}
  