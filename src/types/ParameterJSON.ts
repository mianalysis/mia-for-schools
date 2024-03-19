type ParameterJSON = {
    "name": string,
    "nickname": string,
    "value": string,
    "type": string,
    "visible": boolean,
    "choices": [string],
    "collections": [ParameterJSON]
  }