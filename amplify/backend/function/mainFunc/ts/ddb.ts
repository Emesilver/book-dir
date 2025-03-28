import {
  DynamoDBClient,
  AttributeValue,
  PutItemCommandInput,
  PutItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommand,
  GetItemCommandInput,
  GetItemCommand,
  QueryCommandInput,
  QueryCommand,
  QueryCommandOutput,
  ScanCommandInput,
  ScanCommand,
  ScanCommandOutput,
  TransactWriteItemsInput,
  TransactWriteItem,
  Put,
  TransactWriteItemsCommand,
  TransactGetItemsInput,
  TransactGetItem,
  Get,
  TransactGetItemsCommand,
} from "@aws-sdk/client-dynamodb";

/**
 * Add a new record or override an existing one
 * @param ddbClient Client dynamoDB
 * @param tableName Table name to add data
 * @param rawItem Record to add
 */
export async function putDDBRawItem(
  ddbClient: DynamoDBClient,
  tableName: string,
  rawItem: Record<string, AttributeValue>
) {
  const params: PutItemCommandInput = {
    TableName: tableName,
    Item: rawItem,
  };
  try {
    await ddbClient.send(new PutItemCommand(params));
  } catch (error) {
    console.log("putDDBRawItem failed:", error.message);
  }
}

/**
 * Update an existing record or add a new one if the key doesn't exist
 * @param ddbClient Client dynamoDB
 * @param tableName Table name to add data
 * @param key Partition and sort keys to update
 * @param updateExp Update instruction
 * @param expAttValues New values
 */
export async function updateDDBRawItem(
  ddbClient: DynamoDBClient,
  tableName: string,
  key: Record<string, AttributeValue>,
  updateExp: string,
  expAttValues: Record<string, AttributeValue>
) {
  const params: UpdateItemCommandInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExp,
    ExpressionAttributeValues: expAttValues,
  };
  try {
    await ddbClient.send(new UpdateItemCommand(params));
  } catch (error) {
    console.log("updateDDBRawItem failed:", error.message);
  }
}

/**
 * Read a DynamoDB item
 * @param ddbClient Client dynamoDB
 * @param tableName Table name to add data
 * @param key Partition and sort keys to find
 * @returns a record in DynamoDB format
 */
export async function getDDBRawItem(
  ddbClient: DynamoDBClient,
  tableName: string,
  key: Record<string, AttributeValue>
): Promise<Record<string, AttributeValue>> {
  const params: GetItemCommandInput = {
    TableName: tableName,
    Key: key,
  };
  try {
    const getResult = await ddbClient.send(new GetItemCommand(params));
    return getResult.Item;
  } catch (error) {
    throw new Error("getDDBRawItem failed:" + error.message);
  }
}

export type IndexInfo = {
  indexName: string;
  pkFieldName: string;
  skFieldName: string;
};
export type SKFilter = {
  sk?: string;
  skBeginsWith?: string;
  skBetween?: { start: string; end: string };
};
export type QueryOptions = {
  skFilter?: SKFilter;
  indexInfo?: IndexInfo;
  scanForward?: boolean;
  limit?: number;
};
/**
 * Query items on a table or index depending on how indexInfo is defined.
 * @param ddbClient Client dynamoDB
 * @param tableName Table name to add data
 * @param pk Partition key value to query on table or index
 * @param queryOptions Index and sort key information to filter
 * @returns Records in DynamoDB format
 */
export async function queryDDBRawItems(
  ddbClient: DynamoDBClient,
  tableName: string,
  pk: string,
  queryOptions?: QueryOptions
): Promise<Record<string, AttributeValue>[]> {
  const pkFieldName = queryOptions?.indexInfo
    ? queryOptions.indexInfo.pkFieldName
    : "pk";
  const skFieldName = queryOptions?.indexInfo
    ? queryOptions.indexInfo.skFieldName
    : "sk";
  let keysCondition = `${pkFieldName} = :pk`;
  let expAttrValues: Record<string, AttributeValue> = { ":pk": { S: pk } };
  if (queryOptions?.skFilter?.sk) {
    keysCondition += ` AND ${pkFieldName} = :sk`;
    expAttrValues[":sk"] = { S: queryOptions.skFilter.sk };
  }
  if (queryOptions?.skFilter?.skBeginsWith) {
    keysCondition += ` AND begins_with(${skFieldName}, :skBW)`;
    expAttrValues[":skBW"] = { S: queryOptions.skFilter.skBeginsWith };
  }
  if (queryOptions?.skFilter?.skBetween) {
    keysCondition += ` AND ${skFieldName} BETWEEN :skStart AND :skEnd`;
    expAttrValues[":skStart"] = { S: queryOptions.skFilter.skBetween.start };
    expAttrValues[":skEnd"] = { S: queryOptions.skFilter.skBetween.end };
  }
  const params: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: keysCondition,
    ExpressionAttributeValues: expAttrValues,
  };
  let expAttrNames: Record<string, string> = undefined;
  if (pkFieldName.startsWith("#"))
    expAttrNames = { [pkFieldName]: pkFieldName.split("#")[1] };
  if (skFieldName.startsWith("#") && queryOptions?.skFilter)
    expAttrNames = {
      ...expAttrNames,
      [skFieldName]: skFieldName.split("#")[1],
    };
  if (expAttrNames) params.ExpressionAttributeNames = expAttrNames;
  if (queryOptions?.indexInfo)
    params.IndexName = queryOptions.indexInfo.indexName;
  if (queryOptions?.limit) params.Limit = queryOptions.limit;
  if (queryOptions?.scanForward !== undefined)
    params.ScanIndexForward = queryOptions.scanForward;
  try {
    let queryResult: QueryCommandOutput;
    let allItems: Record<string, AttributeValue>[] = [];
    let limitMet = false;
    do {
      params.ExclusiveStartKey = queryResult?.LastEvaluatedKey;
      queryResult = await ddbClient.send(new QueryCommand(params));
      allItems = allItems.concat(queryResult.Items);

      if (queryOptions?.limit) {
        if (allItems.length > queryOptions.limit)
          allItems = allItems.slice(0, queryOptions.limit);
        limitMet = allItems.length === queryOptions.limit;
      }
    } while (queryResult.LastEvaluatedKey && !limitMet);
    return allItems;
  } catch (error) {
    throw new Error("queryDDBRawItems failed:" + error.message);
  }
}

export type ScanFilter = {
  filterExpression: string;
  expressionAttributeValues: Record<string, AttributeValue>;
};
export type ScanOptions = {
  indexName?: string;
  scanFilter?: ScanFilter;
};
export async function scanDDBRawItems(
  ddbClient: DynamoDBClient,
  tableName: string,
  scanOptions?: ScanOptions
) {
  const params: ScanCommandInput = {
    TableName: tableName,
  };
  if (scanOptions?.scanFilter) {
    params.FilterExpression = scanOptions.scanFilter.filterExpression;
    params.ExpressionAttributeValues =
      scanOptions.scanFilter.expressionAttributeValues;
  }
  try {
    let scanResult: ScanCommandOutput;
    let allItems: Record<string, AttributeValue>[] = [];
    do {
      params.ExclusiveStartKey = scanResult?.LastEvaluatedKey;
      scanResult = await ddbClient.send(new ScanCommand(params));
      allItems = allItems.concat(scanResult.Items);
    } while (scanResult.LastEvaluatedKey);
    return allItems;
  } catch (error) {
    throw new Error("scanDDBRawItems failed:" + error.message);
  }
}

export type AfterReadFilter = {
  filterExpression: string;
  expressionAttributeValues: Record<string, AttributeValue>;
};
export type InefficientFilter = {
  queryOptions?: QueryOptions;
  afterReadFilter?: AfterReadFilter;
};
/**
 * Query items on a table or index using FilterExpression.
 * USE IT CAREFULLY!
 * @param ddbClient Client dynamoDB
 * @param tableName Table name to add data
 * @param pk Partition key value to query on table or index
 * @param inefficientFilter Filter expression and query options info
 * @returns Records in DynamoDB format
 */
export async function inefficientQueryDDBRawItems(
  ddbClient: DynamoDBClient,
  tableName: string,
  pk: string,
  inefficientFilter?: InefficientFilter
): Promise<Record<string, AttributeValue>[]> {
  const pkFieldName = inefficientFilter?.queryOptions?.indexInfo
    ? inefficientFilter?.queryOptions.indexInfo.pkFieldName
    : "pk";
  const skFieldName = inefficientFilter?.queryOptions?.indexInfo
    ? inefficientFilter?.queryOptions.indexInfo.skFieldName
    : "sk";
  let keysCondition = `${pkFieldName} = :pk`;
  let expAttrValues: Record<string, AttributeValue> = { ":pk": { S: pk } };
  if (inefficientFilter?.queryOptions?.skFilter?.sk) {
    keysCondition += ` AND ${pkFieldName} = :sk`;
    expAttrValues[":sk"] = { S: inefficientFilter?.queryOptions.skFilter.sk };
  }
  if (inefficientFilter?.queryOptions?.skFilter?.skBeginsWith) {
    keysCondition += ` AND begins_with(${skFieldName}, :skBW)`;
    expAttrValues[":skBW"] = {
      S: inefficientFilter?.queryOptions.skFilter.skBeginsWith,
    };
  }
  if (inefficientFilter?.queryOptions?.skFilter?.skBetween) {
    keysCondition += ` AND ${skFieldName} BETWEEN :skStart AND :skEnd`;
    expAttrValues[":skStart"] = {
      S: inefficientFilter?.queryOptions.skFilter.skBetween.start,
    };
    expAttrValues[":skEnd"] = {
      S: inefficientFilter?.queryOptions.skFilter.skBetween.end,
    };
  }
  const params: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: keysCondition,
    ExpressionAttributeValues: expAttrValues,
  };
  if (inefficientFilter?.queryOptions?.indexInfo)
    params.IndexName = inefficientFilter?.queryOptions.indexInfo.indexName;
  if (inefficientFilter?.queryOptions?.limit)
    params.Limit = inefficientFilter?.queryOptions.limit;
  if (inefficientFilter?.queryOptions?.scanForward !== undefined)
    params.ScanIndexForward = inefficientFilter?.queryOptions.scanForward;

  // Filtering records after consuming RCU ------------
  if (inefficientFilter?.afterReadFilter) {
    params.FilterExpression =
      inefficientFilter.afterReadFilter.filterExpression;
    params.ExpressionAttributeValues = {
      ...params.ExpressionAttributeValues,
      ...inefficientFilter.afterReadFilter.expressionAttributeValues,
    };
  }
  //---------------------------------------------------

  try {
    let queryResult: QueryCommandOutput;
    let allItems: Record<string, AttributeValue>[] = [];
    let limitMet = false;
    do {
      params.ExclusiveStartKey = queryResult?.LastEvaluatedKey;
      queryResult = await ddbClient.send(new QueryCommand(params));
      allItems = allItems.concat(queryResult.Items);

      if (inefficientFilter?.queryOptions?.limit) {
        if (allItems.length > inefficientFilter?.queryOptions.limit)
          allItems = allItems.slice(0, inefficientFilter?.queryOptions.limit);
        limitMet = allItems.length === inefficientFilter?.queryOptions.limit;
      }
    } while (queryResult.LastEvaluatedKey && !limitMet);
    return allItems;
  } catch (error) {
    throw new Error("inefficientQueryDDBRawItems failed:" + error.message);
  }
}

export enum WriteDDBRawTranType {
  PUT = "put",
  UPDATE = "update",
  DELETE = "delete",
  CONDITION = "condition",
}
export type WriteDDBRawTranCommand = {
  commandType: WriteDDBRawTranType;
  rawItem: Record<string, AttributeValue>;
};
export async function writeDDBRawTran(
  ddbClient: DynamoDBClient,
  tableName: string,
  rawWriteItems: WriteDDBRawTranCommand[]
) {
  const params: TransactWriteItemsInput = {
    TransactItems: [],
  };
  for (const rawWriteItem of rawWriteItems) {
    if (rawWriteItem.commandType === WriteDDBRawTranType.PUT) {
      const putParam: Put = {
        TableName: tableName,
        Item: rawWriteItem.rawItem,
      };
      const transactionItem: TransactWriteItem = { Put: putParam };
      params.TransactItems.push(transactionItem);
    }
    if (rawWriteItem.commandType === WriteDDBRawTranType.UPDATE) {
      // TODO
    }
    if (rawWriteItem.commandType === WriteDDBRawTranType.DELETE) {
      // TODO
    }
    if (rawWriteItem.commandType === WriteDDBRawTranType.CONDITION) {
      // TODO
    }
  }
  try {
    await ddbClient.send(new TransactWriteItemsCommand(params));
  } catch (error) {
    console.log("writeDDBRawTransaction failed:", error.message);
  }
}

/**
 * Read multiple items in a transaction
 */
export async function getDDBRawTran(
  ddbClient: DynamoDBClient,
  tableName: string,
  rawKeys: Record<string, AttributeValue>[]
) {
  const params: TransactGetItemsInput = {
    TransactItems: [],
  };
  for (const rawKey of rawKeys) {
    const getKey: Get = {
      Key: rawKey,
      TableName: tableName,
    };
    const transactGetItem: TransactGetItem = {
      Get: getKey,
    };
    params.TransactItems.push(transactGetItem);
  }
  try {
    const transactResult = await ddbClient.send(
      new TransactGetItemsCommand(params)
    );
    return transactResult.Responses;
  } catch (error) {
    console.log("getDDBRawTransaction failed:", error.message);
  }
}
