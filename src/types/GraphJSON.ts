type GraphJSON = {
    "source": "Channel components" | "Image measurement",
    "data": DataJSON
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