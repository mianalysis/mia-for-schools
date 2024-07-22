import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { createEffect, on } from 'solid-js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

interface Props {
    dataJSON: DataJSON;
    imageID: string,
    type: string
}

let chart = undefined;
var prevImageID = ""

export default function Graph(props: Props) {
    createEffect(
        on(
            () => props.dataJSON,
            () => {
                const graph_canvas = document.getElementById('chart-canvas') as HTMLCanvasElement;
                if (props.imageID != prevImageID && chart != undefined) {
                    chart.destroy()
                    chart = undefined
                }

                if (chart == undefined) {
                    prevImageID = props.imageID;

                    chart = new Chart(graph_canvas, {
                        type: props.type as keyof ChartTypeRegistry,
                        data: props.dataJSON,
                        options: {
                            animation: {
                                duration: 0
                            },
                            plugins: {
                                datalabels: {
                                    color: 'white',
                                    formatter: function (value, context) {
                                        var sum = 0;
                                        for (var idx = 0; idx < props.dataJSON.datasets[0].data.length; idx++)
                                            sum = sum + props.dataJSON.datasets[0].data[idx]

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
                    chart.data = props.dataJSON;
                    chart.update()
                }
            }));

    return (
        <canvas id="chart-canvas"></canvas>
    );
}
