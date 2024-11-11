import { DynamoDBClient,  AttributeValue } from '@aws-sdk/client-dynamodb'
import { buildSETUpdateExpression, ddbToObject, objectToDDB } from './ddb-utils';
import { getDDBRawItem, IndexInfo, putDDBRawItem, queryDDBRawItems, SKFilter, updateDDBRawItem } from './ddb';
  
export class DDBRepository {
  private tableName: string;
  private ddbClient: DynamoDBClient;
  constructor(tableName: string, ddbClient: DynamoDBClient) {
    this.tableName = tableName;
    this.ddbClient = ddbClient;
  }

  public async putDDBItem(pk: string, sk: string, item: Object) {
    const rawItem: Record<string, AttributeValue> = {
      pk: {S: pk},
      sk: {S: sk},
      ...objectToDDB(item)
    }
    await putDDBRawItem(this.ddbClient,this.tableName, rawItem);
  }

  public async upsertDDBItem(pk: string, sk: string, item: Object) {
    const key: Record<string, AttributeValue> = {pk: {S: pk}, sk: {S: sk}};
    const updateExp = buildSETUpdateExpression(item);
    const updateExpValues = objectToDDB(item, ':');
    await updateDDBRawItem(
      this.ddbClient, 
      this.tableName, 
      key, updateExp, updateExpValues
    );
  }

  public async getDDBItem<T>(pk: string, sk: string) {
    const key: Record<string, AttributeValue> = {pk: {S: pk}, sk: {S: sk}};
    const rawItem = await getDDBRawItem(this.ddbClient, this.tableName, key);
    const retObj = ddbToObject<T>(rawItem);
    return retObj;
  }

  public async queryDDBItemsPk<T>(pk: string, indexInfo?: IndexInfo) {
    const rawItems = await queryDDBRawItems(
      this.ddbClient, 
      this.tableName,
      indexInfo,
      pk
    );
    const retObjs = rawItems.map(rawItem => ddbToObject<T>(rawItem));
    return retObjs;
  }
}