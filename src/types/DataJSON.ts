type DataJSON = {
    labels: string[],
    datasets: DatasetJSON[]
};

type DatasetJSON = {
    label: string,
    data: number[],
    borderWidth: number
}
