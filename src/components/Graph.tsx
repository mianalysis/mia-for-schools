import Chart from 'chart.js/auto';
import { createEffect, on } from 'solid-js';


interface Props {
    plot_data: number[]
}

let chart = undefined;

export default function Graph(props: Props) {
    createEffect(
        on(
            () => props.plot_data,
            () => {
                const graph_canvas = document.getElementById('chart-canvas') as HTMLCanvasElement;
                if (chart == undefined) {
                    chart = new Chart(graph_canvas, {
                        type: 'pie',
                        data: {
                            labels: ['Red', 'Green', 'Blue'],
                            datasets: [{
                                label: 'Channels',
                                data: props.plot_data,
                                backgroundColor: ['red', 'green', 'blue'],
                                borderWidth: 2
                            }]
                        },
                        options: {
                            animation: {
                                duration: 0
                            },
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }
                    });
                } else {
                    chart.data.datasets[0].data = props.plot_data;
                    chart.update()
                }
            }));

    return (
        <canvas id="chart-canvas"></canvas>
    );
}