import { DynamoDBClient,  AttributeValue,
    PutItemCommandInput, PutItemCommand,
    UpdateItemCommandInput, UpdateItemCommand
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
    console.log('Falha em putDDBItem:', error.message)
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
    console.log('Falha em updateDDBItem:', error.message)
  }
}
