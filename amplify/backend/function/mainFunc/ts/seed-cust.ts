import { Customer, CustomerReferral } from "./cust.type";
import {
  DDBRepository,
  WriteDDBTranItemType,
  WriteDDBTransactionOperation,
} from "./ddb-repository";
import { DDBClient } from "./ddb-utils";

export async function seedCustomers() {
  const custsRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const custReferralRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const seedList = getCustomers();
  for (const { customer, customerReferral } of seedList) {
    // TODO: Put below putDDBItem functions into a transaction.
    await custsRep.putDDBItem(customer.cust_id, "CUSTOMER", customer);
    if (customerReferral) {
      await custReferralRep.putDDBItem(
        customerReferral.cust_referrer_id,
        `CUSTOMER-REFERRAL#${customerReferral.cust_referred_id}`,
        customerReferral
      );
    }
    console.log("Added " + customer.name);
  }
}

export async function seedCustomersTran() {
  const custsRep = new DDBRepository("cadastro-dev", DDBClient.client());
  const seedList = getCustomers();
  for (const { customer, customerReferral } of seedList) {
    const transactionOperations: WriteDDBTransactionOperation[] = [];
    const newCustomer: WriteDDBTransactionOperation = {
      itemType: WriteDDBTranItemType.PUT,
      item: {
        pk: customer.cust_id,
        sk: "CUSTOMER",
        item: customer,
      },
    };
    transactionOperations.push(newCustomer);

    if (customerReferral) {
      const newCustomerReferral: WriteDDBTransactionOperation = {
        itemType: WriteDDBTranItemType.PUT,
        item: {
          pk: customerReferral.cust_referrer_id,
          sk: `CUSTOMER-REFERRAL#${customerReferral.cust_referred_id}`,
          item: customerReferral,
        },
      };
      transactionOperations.push(newCustomerReferral);
    }
    await custsRep.writeDDBTransaction(transactionOperations);
    console.log("Added in transaction: " + customer.name);
  }
}

// Returns a list of {customer, customerReferral}
function getCustomers(): {
  customer: Customer;
  customerReferral?: CustomerReferral;
}[] {
  return [
    {
      customer: {
        cust_id: "CST-A",
        name: "Customer A",
      },
    },
    {
      customer: {
        cust_id: "CST-B",
        name: "Customer B",
      },
      customerReferral: {
        cust_referrer_id: "CST-A",
        cust_referred_id: "CST-B",
      },
    },
    {
      customer: {
        cust_id: "CST-C",
        name: "Customer C",
      },
      customerReferral: {
        cust_referrer_id: "CST-B",
        cust_referred_id: "CST-C",
      },
    },
    {
      customer: {
        cust_id: "CST-D",
        name: "Customer D",
      },
      customerReferral: {
        cust_referrer_id: "CST-B",
        cust_referred_id: "CST-D",
      },
    },
    {
      customer: {
        cust_id: "CST-E",
        name: "Customer E",
      },
    },
  ];
}
