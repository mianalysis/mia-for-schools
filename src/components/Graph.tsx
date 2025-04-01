import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { createEffect, on } from 'solid-js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface Props {
    graphJSON: GraphJSON;
    imageJSON: ImageJSON;
}

let chart = undefined;

export default function Graph(props: Props) {
    if (props.graphJSON == undefined)
        return;

    createEffect(
        on(
            () => props.graphJSON,
            () => {
                const graph_canvas = document.getElementById('chart-canvas') as HTMLCanvasElement;
                if (chart != undefined && props.imageJSON != undefined) {
                    chart.destroy()
                    chart = undefined
                }

                if (chart === undefined) {
                    chart = new Chart(graph_canvas, {
                        type: props.graphJSON.type as keyof ChartTypeRegistry,
                        data: props.graphJSON.data,
                        options: {
                            animation: {
                                duration: 0
                            },
                            responsive: true,
                            // maintainAspectRatio: false,
                            plugins: {
                                datalabels: {
                                    display: props.graphJSON.showDataLabels,
                                    color: 'white',
                                    formatter: function (value, context) {
                                        var sum = 0;
                                        for (var idx = 0; idx < props.graphJSON.data.datasets[0].data.length; idx++)
                                            sum = sum + props.graphJSON.data.datasets[0].data[idx]

                                        return context.chart.data.labels[context.dataIndex] + '\n' + Math.round(100 * (value / sum)) + '%';

                                    },
                                    textAlign: 'center',
                                    font: {
                                        size: 14
                                    }
                                },
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                x: {
                                    display: props.graphJSON.showXAxis ?? true,
                                    grid: {
                                        display: props.graphJSON.showXGrid ?? true
                                    },
                                    title: {
                                        display: true,
                                        align: 'center',
                                        text: props.graphJSON.xlabel,
                                        color: '#14b8a6',
                                        font: {
                                            family: 'Arial',
                                            size: 16,
                                            weight: 'bold',
                                        },
                                    }
                                },
                                y: {
                                    display: props.graphJSON.showYAxis ?? true,
                                    grid: {
                                        display: props.graphJSON.showYGrid ?? true
                                    },
                                    title: {
                                        display: true,
                                        align: 'center',
                                        text: props.graphJSON.ylabel,
                                        color: '#14b8a6',
                                        font: {
                                            family: 'Arial',
                                            size: 16,
                                            weight: 'bold',
                                        },
                                    }
                                }
                            }
                        }
                    });
                } else {
                    chart.data = props.graphJSON.data;
                    chart.update();
                }
            }));

    return (
        <canvas id="chart-canvas" class="h-16"></canvas>
    );
}
0