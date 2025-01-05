import { DDBRepository } from "./ddb-repository";
import { DDBClient } from "./ddb-utils";
import { Produto } from "./prod.type";

export async function seedProds() {
  const seedProdsRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const prodNames = getProdNames();
  for (const index of prodNames.keys()) {
    const prod: Produto = {
      codigo: "PR" + ("000" + index + 1).slice(-3),
      nome: prodNames[index],
      preco: 10,
      dataCriacao: "2025-01-04T12:25:34.795Z",
      armazem: { nome: "CD-SP", qtde: 5 },
    };
    await seedProdsRep.putDDBItem(prod.codigo, 'PRODUTO', prod);
    console.log('Added ' + prod.nome)
  }
}

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
