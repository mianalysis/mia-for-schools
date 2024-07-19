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
