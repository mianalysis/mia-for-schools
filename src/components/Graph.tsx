import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { createEffect, on } from 'solid-js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface Props {
    graphJSON: GraphJSON;
    imageJSON: ImageJSON;
    type: string
}

let chart = undefined;
var prevImageID = ""

export default function Graph(props: Props) {
    if (props.graphJSON == undefined)
        return;

    createEffect(
        on(
            () => props.graphJSON,
            () => {
                const graph_canvas = document.getElementById('chart-canvas') as HTMLCanvasElement;
                if (chart != undefined && props.imageJSON != undefined && props.imageJSON.name != prevImageID) {
                    chart.destroy()
                    chart = undefined
                }

                if (chart == undefined) {
                    if (props.imageJSON == undefined)
                        prevImageID = ""
                    else
                        prevImageID = props.imageJSON.name;

                    chart = new Chart(graph_canvas, {
                        type: props.type as keyof ChartTypeRegistry,
                        data: props.graphJSON.data,
                        options: {
                            animation: {
                                duration: 0
                            },
                            responsive: false,
                            plugins: {
                                datalabels: {
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
                            }
                        }
                    });
                } else {
                    chart.data = props.graphJSON.data;
                    chart.update()
                }
            }));

    return (
        <canvas id="chart-canvas" class="h-16"></canvas>
    );
}
0