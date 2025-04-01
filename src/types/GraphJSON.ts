type GraphJSON = {
  source:
    | 'Channel components'
    | 'Image intensity histogram'
    | 'Object measurements'
    | 'Object measurement histogram';
  data: DataJSON;
  type: 'pie' | 'bar';
  showDataLabels: boolean;
  showXAxis: boolean | undefined;
  showYAxis: boolean | undefined;
  showXGrid: boolean | undefined;
  showYGrid: boolean | undefined;
  xlabel: string;
  ylabel: string;
};

type DataJSON = {
  labels: string[];
  datasets: DatasetJSON[];
};

type DatasetJSON = {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderWidth: number;
};
