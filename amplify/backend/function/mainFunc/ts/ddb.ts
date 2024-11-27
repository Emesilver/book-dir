import { DynamoDBClient,  AttributeValue,
    PutItemCommandInput, PutItemCommand,
    UpdateItemCommandInput, UpdateItemCommand,
    GetItemCommandInput, GetItemCommand,
    QueryCommandInput, QueryCommand, QueryCommandOutput,
    ScanCommandInput, ScanCommand, ScanCommandOutput
 } from '@aws-sdk/client-dynamodb'

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
    Item: rawItem
  }
  try {
    await ddbClient.send(new PutItemCommand(params));    
  } catch (error) {
    console.log('putDDBRawItem failed:', error.message)
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
    ExpressionAttributeValues: expAttValues
  }
  try {
    await ddbClient.send(new UpdateItemCommand(params));    
  } catch (error) {
    console.log('updateDDBRawItem failed:', error.message)
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
    Key: key
  }
  try {
    const getResult = await ddbClient.send(new GetItemCommand(params));
    return getResult.Item;
  } catch (error) {
    throw new Error('getDDBRawItem failed:'+ error.message)
  }
}

export type IndexInfo = {
  indexName: string;
  pkFieldName: string;
  skFieldName: string;
}
export type SKFilter = { 
  sk?: string;
  skBeginsWith?: string;
  skBetween?: {start: string, end: string}
}
export type QueryOptions = {
  skFilter?: SKFilter;
  indexInfo?: IndexInfo;
}
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
    : 'pk';
  const skFieldName = queryOptions?.indexInfo 
    ? queryOptions.indexInfo.skFieldName 
    : 'sk';
  let keysCondition = `${pkFieldName} = :pk`;
  let expAttrValues: Record<string, AttributeValue> = {':pk': {S: pk}}
  if (queryOptions?.skFilter?.sk) {
    keysCondition += ` AND ${pkFieldName} = :sk`;
    expAttrValues[':sk'] = {S: queryOptions.skFilter.sk}
  }
  if (queryOptions?.skFilter?.skBeginsWith) {
    keysCondition += ` AND begins_with(${skFieldName}, :skBW)`;
    expAttrValues[':skBW'] = {S: queryOptions.skFilter.skBeginsWith}
  }
  if (queryOptions?.skFilter?.skBetween) {
    keysCondition += ` AND ${skFieldName} BETWEEN :skStart AND :skEnd`;
    expAttrValues[':skStart'] = {S: queryOptions.skFilter.skBetween.start};
    expAttrValues[':skEnd'] = {S: queryOptions.skFilter.skBetween.end};
  }
  const params: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: keysCondition,
    ExpressionAttributeValues: expAttrValues
  }
  if (queryOptions?.indexInfo) params.IndexName = queryOptions.indexInfo.indexName;
  try {
    let queryResult: QueryCommandOutput;
    let allItems: Record<string, AttributeValue>[] = [];
    do {
      params.ExclusiveStartKey = queryResult?.LastEvaluatedKey;
      queryResult = await ddbClient.send(new QueryCommand(params));
      allItems = allItems.concat(queryResult.Items);
    } while (queryResult.LastEvaluatedKey) 
    return allItems;
  } catch (error) {
    throw new Error('queryDDBRawItems failed:' + error.message)
  }
}

export type ScanFilter = {
  filterExpression: string;
  expressionAttributeValues: Record<string, AttributeValue>;
}
export type ScanOptions = {
  indexName?: string;
  scanFilter?: ScanFilter;
}
export async function scanDDBRawItems(
  ddbClient: DynamoDBClient,
  tableName: string,
  scanOptions?: ScanOptions,
){
  const params: ScanCommandInput = {
    TableName: tableName,
  }
  if (scanOptions?.scanFilter) {
    params.FilterExpression = scanOptions.scanFilter.filterExpression;
    params.ExpressionAttributeValues = scanOptions.scanFilter.expressionAttributeValues;
  }
  try {
    let scanResult: ScanCommandOutput;
    let allItems: Record<string, AttributeValue>[] = [];
    do {
      params.ExclusiveStartKey = scanResult?.LastEvaluatedKey;
      scanResult = await ddbClient.send(new ScanCommand(params));
      allItems = allItems.concat(scanResult.Items);
    } while (scanResult.LastEvaluatedKey) 
    return allItems;
  } catch (error) {
    throw new Error('scanDDBRawItems failed:' + error.message)
  }
}
