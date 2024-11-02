import { DynamoDBClient,  AttributeValue,
    PutItemCommandInput, PutItemCommand,
    UpdateItemCommandInput, UpdateItemCommand,
    GetItemCommandInput, GetItemCommand
 } from '@aws-sdk/client-dynamodb'

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
    console.log('putDDBItem failed:', error.message)
  }
}

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
    console.log('updateDDBItem failed:', error.message)
  }
}

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
    console.log('getDDBItem failed:', error.message)
  }
}