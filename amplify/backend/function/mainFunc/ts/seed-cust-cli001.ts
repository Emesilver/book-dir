import { DDBRepository } from "./ddb-repository";
import { DDBClient } from "./ddb-utils";

export async function seedCustCli001() {
  const custRep = new DDBRepository("cadastro-dev", DDBClient.client());
  await custRep.putDDBItem("CLI001", "CUSTOMER", {
    client_id: "CLI001",
    client_name: "EMERSON",
    client_limit: 1000,
  });
  console.log("Client CLI001 added");
}
