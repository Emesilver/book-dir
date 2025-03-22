import { DynamoDBClient, AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  buildSETUpdateExpression,
  ddbToObject,
  objectToDDB,
} from "./ddb-utils";
import {
  getDDBRawItem,
  getDDBRawTran,
  InefficientFilter,
  inefficientQueryDDBRawItems,
  putDDBRawItem,
  queryDDBRawItems,
  QueryOptions,
  scanDDBRawItems,
  ScanOptions,
  updateDDBRawItem,
  writeDDBRawTran,
  WriteDDBRawTranCommand,
  WriteDDBRawTranType,
} from "./ddb";

export enum WriteDDBTranItemType {
  PUT = "put",
  UPDATE = "update",
  DELETE = "delete",
}
export type WriteDDBTransactionOperation = {
  itemType: WriteDDBTranItemType;
  item: {
    pk: string;
    sk: string;
    item: Object;
  };
};
export type PkSkGet = {
  pk: string;
  sk: string;
};
export class DDBRepository {
  private tableName: string;
  private ddbClient: DynamoDBClient;
  constructor(tableName: string, ddbClient: DynamoDBClient) {
    this.tableName = tableName;
    this.ddbClient = ddbClient;
  }

  public async putDDBItem(pk: string, sk: string, item: Object) {
    const rawItem = this.buildRawItem(pk, sk, item);
    await putDDBRawItem(this.ddbClient, this.tableName, rawItem);
  }

  public async upsertDDBItem(pk: string, sk: string, item: Object) {
    const key: Record<string, AttributeValue> = {
      pk: { S: pk },
      sk: { S: sk },
    };
    let updateExp = buildSETUpdateExpression(item);
    const updateExpValues = objectToDDB(item, ":");
    if (item["name"]) {
      updateExp += ", name_upper=:name_upper";
      updateExpValues[":name_upper"] = {
        S: (item["name"] as string).toUpperCase(),
      };
    }
    await updateDDBRawItem(
      this.ddbClient,
      this.tableName,
      key,
      updateExp,
      updateExpValues
    );
  }

  public async writeDDBTransaction(
    transactionOperations: WriteDDBTransactionOperation[]
  ) {
    const rawWriteItems: WriteDDBRawTranCommand[] = [];
    for (const transactionOperation of transactionOperations) {
      if (transactionOperation.itemType === WriteDDBTranItemType.PUT) {
        const rawItem = this.buildRawItem(
          transactionOperation.item.pk,
          transactionOperation.item.sk,
          transactionOperation.item.item
        );
        const writeDDBRawTransCommand: WriteDDBRawTranCommand = {
          commandType: WriteDDBRawTranType.PUT,
          rawItem: rawItem,
        };
        rawWriteItems.push(writeDDBRawTransCommand);
      }
      if (transactionOperation.itemType === WriteDDBTranItemType.UPDATE) {
        // TODO
      }
      if (transactionOperation.itemType === WriteDDBTranItemType.DELETE) {
        // TODO
      }
    }

    await writeDDBRawTran(this.ddbClient, this.tableName, rawWriteItems);
  }

  public async getDDBTransaction<T1, T2>(pkSkGet1: PkSkGet, pkSkGet2: PkSkGet) {
    const rawKeys: Record<string, AttributeValue>[] = [
      { pk: { S: pkSkGet1.pk }, sk: { S: pkSkGet1.sk } },
      { pk: { S: pkSkGet2.pk }, sk: { S: pkSkGet2.sk } },
    ];
    const retObjs = await getDDBRawTran(
      this.ddbClient,
      this.tableName,
      rawKeys
    );
    return {
      itemFromKey1: ddbToObject<T1>(retObjs[0].Item),
      itemFromKey2: ddbToObject<T2>(retObjs[1].Item),
    };
  }

  public async getDDBItem<T>(pk: string, sk: string) {
    const key: Record<string, AttributeValue> = {
      pk: { S: pk },
      sk: { S: sk },
    };
    const rawItem = await getDDBRawItem(this.ddbClient, this.tableName, key);
    const retObj = ddbToObject<T>(rawItem);
    return retObj;
  }

  public async queryDDBItems<T>(pk: string, queryOptions?: QueryOptions) {
    const rawItems = await queryDDBRawItems(
      this.ddbClient,
      this.tableName,
      pk,
      queryOptions
    );
    const retObjs = rawItems.map((rawItem) => ddbToObject<T>(rawItem));
    return retObjs;
  }

  public async scanDDBItems(scanOptions?: ScanOptions) {
    const rawItems = await scanDDBRawItems(
      this.ddbClient,
      this.tableName,
      scanOptions
    );
    const retObjs = rawItems.map((rawItem) => ddbToObject<any>(rawItem));
    return retObjs;
  }

  public async inefficientQueryDDBItems<T>(
    pk: string,
    inefficientFilter?: InefficientFilter
  ) {
    const rawItems = await inefficientQueryDDBRawItems(
      this.ddbClient,
      this.tableName,
      pk,
      inefficientFilter
    );
    const retObjs = rawItems.map((rawItem) => ddbToObject<T>(rawItem));
    return retObjs;
  }

  private buildRawItem(pk: string, sk: string, item: Object) {
    const rawItem: Record<string, AttributeValue> = {
      pk: { S: pk },
      sk: { S: sk },
      ...objectToDDB(item),
    };
    if (item["name"])
      rawItem["name_upper"] = { S: (item["name"] as string).toUpperCase() };
    return rawItem;
  }
}
