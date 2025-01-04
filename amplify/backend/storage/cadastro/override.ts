import { AmplifyDDBResourceTemplate, AmplifyProjectInfo } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyDDBResourceTemplate, amplifyProjectInfo: AmplifyProjectInfo) {
  // Other than dev environments uses OnDemand capacity mode
  if (amplifyProjectInfo.envName !== 'dev') {
    delete resources.dynamoDBTable.provisionedThroughput;
    resources.dynamoDBTable.billingMode = "PAY_PER_REQUEST";
    if (resources.dynamoDBTable.globalSecondaryIndexes) {
      let ind = 0;
      while (resources.dynamoDBTable.globalSecondaryIndexes[ind]?.provisionedThroughput) {
        delete resources.dynamoDBTable.globalSecondaryIndexes[ind].provisionedThroughput;
        ind++;
      }
    }  
  }
}
