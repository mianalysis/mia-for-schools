import { sendParameter } from '../lib/util';

import { createUniqueId, onMount } from 'solid-js';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import wNumb from 'wnumb';

interface Props {
  parameter: ParameterJSON;
}

export default function ParameterSlider(props: Props) {
  const sliderId = createUniqueId();
  var sliderWidth : number = 64;

  const matchArray = props.parameter.nickname.match(/(.+)S{(.+)}/);
  if (matchArray == null) return;

  const groups = matchArray[2].match(/^([0-9]+)\|([0-9]+)\|([0-9\.]+)(?:\|W([0-9\.]+))?$/);

  if (groups == null) return;

  if (groups[4] != undefined)
      sliderWidth = parseFloat(groups[4])

  const decimalPlacesGroups = groups[3].match(/([0-9]+)\.([0-9]+)/);
  var decimalPlaces = 0;
  if (decimalPlacesGroups !== null) decimalPlaces = decimalPlacesGroups[2].toString().length;

  onMount(() => {
    let slider = document.getElementById(sliderId) as any;
    noUiSlider.create(slider, {
      start: props.parameter.value,
      step: parseFloat(groups[3]),
      connect: true,
      tooltips: true,
      range: {
        min: parseFloat(groups[1]),
        max: parseFloat(groups[2]),
      },
      format: wNumb({ decimals: decimalPlaces }),
    });
    slider.noUiSlider.on('change', function () {
      sendParameter(
        props.parameter.moduleid,
        props.parameter.name,
        slider.noUiSlider.get(),
        props.parameter.parentGroupName,
        props.parameter.groupCollectionNumber
      );
    });
  });

  return (
    <span
      id={sliderId}
      class={`inline-flex h-4 m-4 ml-4 mr-4 w-${sliderWidth} rounded-full bg-emerald-400 appearance-none transition duration-150 ease-in-out hover:scale-105 active:scale-105 hover:bg-orange-500 active:bg-orange-500 mx-auto`}
    ></span>
  );
}
