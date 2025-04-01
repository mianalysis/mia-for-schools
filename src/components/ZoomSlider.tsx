import { onMount } from 'solid-js';
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import wNumb from "wnumb"

interface Props {
  updateZoom: Function
}

export default function ZoomSlider(props: Props) {
  onMount(() => {
    let slider = document.getElementById('zoomSlider') as any;
    noUiSlider.create(slider, {
      start: 1,
      step: 0.1,
      connect: true,
      tooltips: true,
      range: {
        min: 1,
        max: 5
      },
      format: wNumb({ decimals: 1 }),
    })
    slider.noUiSlider.on("update", function () { props.updateZoom(slider.noUiSlider.get()) })

  })

  return (
    <div
      id="zoomSlider"
      class="flex-initial h-4 m-8 w-full rounded-full bg-purple-600 appearance-none transition duration-150 ease-in-out hover:scale-105 active:scale-105 hover:bg-orange-500 active:bg-orange-500">
    </div>);

}
