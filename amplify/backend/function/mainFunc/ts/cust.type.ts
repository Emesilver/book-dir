export type Customer = {
  cust_id: string;
  name: string;
};

// Customer auto relation
export type CustomerReferral = {
  // Customer who referenced cust_referred_id
  cust_referrer_id: string;

  // Customer referenced by cust_referrer_id
  cust_referred_id: string;
};
