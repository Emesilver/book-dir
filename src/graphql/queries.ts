/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPing = /* GraphQL */ `query GetPing($dummy: String) {
  getPing(dummy: $dummy) {
    result
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPingQueryVariables, APITypes.GetPingQuery>;
