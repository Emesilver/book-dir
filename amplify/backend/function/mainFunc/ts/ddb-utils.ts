import { DynamoDBClient,  AttributeValue,
  PutItemCommandInput, PutItemCommand 
} from '@aws-sdk/client-dynamodb'

/**
 * Create a list of props to be used at UpdateExpression
 */
export function buildUpdateExpression(obj: object) {
  return Object.keys(obj).map((key) => key + '=:' + key).join(', ');
}

/**
 * Converte um objeto para formato de gravacao Dynamo:
 * Record<string, AttributeValue>
 */
export function objectToDDB(obj: object, keyNamePrefix?: ':') {
  if (!obj) return;

  const convMap = (objMap: object) => {
    const retObjMap: Record<string, AttributeValue> = {};
    for (const key of Object.keys(objMap)) {
      if (typeof objMap[key] === 'object')
        retObjMap[key] = {M: convMap(objMap[key])}
      else {
        const attributeValue = buildAttributeValue(objMap[key]);
        if (attributeValue) retObjMap[key] = attributeValue;
      }
    }
    return retObjMap;
  }
  
  const retObject: Record<string, AttributeValue> = {};
  for (const key of Object.keys(obj)) {
    const newKey = keyNamePrefix ? keyNamePrefix+key : key;
    if (typeof obj[key] === 'object')
      retObject[newKey] = {M: convMap(obj[key])}
    else {
      const attributeValue = buildAttributeValue(obj[key]);
      if (attributeValue) retObject[newKey] = attributeValue;
    }
  }
  return retObject;
}

/**
 * Return an AttributeValue according to the value type
 */
function buildAttributeValue(value: any): AttributeValue {
  switch (typeof value) {
    case 'string': return { S: value };
    case 'boolean': return { BOOL: value};
    case 'number': return { N: value.toString() };
  }      
}

export class DDBClient {
  private static instance: DynamoDBClient;

  private constructor() {}

  public static client(): DynamoDBClient {
    if (!DDBClient.instance) {
      DDBClient.instance = new DynamoDBClient({region: 'us-east-2'});;
    }
    return DDBClient.instance; 
  }
}