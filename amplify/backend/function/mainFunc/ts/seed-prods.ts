import { DDBRepository } from "./ddb-repository";
import { DDBClient } from "./ddb-utils";
import { Product } from "./prod.type";

export async function seedProds() {
  const seedProdsRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const prodNames = getProdNames();
  for (const index of prodNames.keys()) {
    const prod: Product = {
      // Build prod_id like PR001
      prod_id: "PR" + ("000" + (index + 1)).slice(-3),
      name: prodNames[index],
      price: 10,
      creation_date: "2025-01-04T12:25:34.795Z",
      warehouse: { name: "CD-SP", qty: 5 },
    };
    await seedProdsRep.putDDBItem(prod.prod_id, "PRODUCT", prod);
    console.log("Added " + prod.name);
  }
}

function getProdNames() {
  return [
    "HEADSET GAMER PROFESSIONAL 7.1",
    "MOUSE GAMER RGB",
    "GAMING MECHANICAL KEYBOARD",
    "JOYSTICK ARCADE RETRO",
    "MONITOR GAMER 144HZ",
    "PORTABLE CONSOLE RETRO",
    "VIDEO CARD RTX 4090",
    "PROCESSOR INTEL CORE I9",
    "MEMORY RAM DDR5 64GB",
    "SSD NVME 2TB",
  ];
}
