type ModuleJSON = {
  "time": string,
  "id": string,
  "name": string,
  "nickname": string,
  "canBeDisabled": boolean,
  "enabled": boolean,
  "visibleTitle": boolean,
  "parameters": [ParameterJSON]
};

type ParameterJSON = {
  "moduleid": string,
  "name": string,
  "nickname": string,
  "value": string,
  "type": string,
  "visible": boolean,
  "choices": [string],
  "collections": [ParameterJSON],
  "parentGroupName": string,
  "groupCollectionNumber": number
}