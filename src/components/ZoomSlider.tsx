import { onMount } from 'solid-js';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import wNumb from 'wnumb';

interface Props {
  updateZoom: Function;
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
        max: 5,
      },
      format: wNumb({ decimals: 1 }),
    });
    slider.noUiSlider.on('update', function () {
      props.updateZoom(slider.noUiSlider.get());
    });
  });

  return (
    <div class="container flex overflow-visible rounded-lg shadow-lg bg-white opacity-40 group-hover:opacity-100 w-full m-2 ml-0 transition duration-150 ease-in-out hover:scale-105">
      <img class="flex-none w-6 m-1" src="/images/zoom-svgrepo-com.svg" />
      <div id="zoomSlider" class="w-32 ml-2 mr-2 mt-2.5 h-3 rounded-full bg-purple-600 transition duration-150 ease-in-out hover:bg-orange-500 active:bg-orange-500" />
    </div>
  );
}
