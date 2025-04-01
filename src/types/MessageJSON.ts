type MessageJSON = {
  // "type": "graph" | "parameter" | "text"
  // "data": GraphJSON | ParameterJSON | String
  type: 'parameter' | 'text';
  data: ParameterJSON | String;
};
