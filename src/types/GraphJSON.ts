type GraphJSON = {
    "source": "Channel components" | "Object measurements",
    "data": DataJSON,
    "type": "pie" | "bar",
    "showDataLabels": boolean
}

type DataJSON = {
    labels: string[],
    datasets: DatasetJSON[]
};

type DatasetJSON = {
    label: string,
    data: number[],
    backgroundColor: string[],
    borderWidth: number
}