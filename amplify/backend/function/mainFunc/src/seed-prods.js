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
exports.seedProds = seedProds;
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
