import { createUniqueId, onMount } from 'solid-js';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import wNumb from 'wnumb';
import BrightnessStore from './BrightnessStore';

interface Props {
  image: ImageJSON;
  channel: ChannelJSON;
  updateBC: Function;
}

export default function ChannelSlider(props: Props) {
  const sliderId = createUniqueId();
  const start = BrightnessStore.hasValue(props.image.name, props.channel.index)
    ? BrightnessStore.getValue(props.image.name, props.channel.index) * 100
    : props.channel.strength * 100;

  onMount(() => {
    let slider = document.getElementById(sliderId) as any;
    noUiSlider.create(slider, {
      start: start,
      step: 1,
      connect: true,
      tooltips: true,
      range: {
        min: 0,
        max: 100,
      },
      format: wNumb({ decimals: 0 }),
    });
    slider.noUiSlider.on('update', function () {
      props.updateBC(slider.noUiSlider.get() / 100, props.channel.index);
    });
  });

  return (
    <div class="slider-tooltip-above container flex overflow-visible rounded-lg shadow-lg bg-white opacity-40 group-hover:opacity-100 w-full m-2 ml-0 transition duration-150 ease-in-out hover:scale-105">
      <img class="flex-none w-6 m-1" src="/images/brightness-svgrepo-com.svg" />
      <div
        id={sliderId}
        class="w-full ml-1 mr-3 mt-2.5 h-3 rounded-full"
        style={
          'background: rgb(' +
          (3 * props.channel.red) / 4 +
          ',' +
          (3 * props.channel.green) / 4 +
          ',' +
          (3 * props.channel.blue) / 4 +
          ');'
        }
      ></div>
    </div>
  );
}
