import { sendParameter } from '../lib/util';

import { createUniqueId, onMount } from 'solid-js';
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import wNumb from "wnumb"

interface Props {
    parameter: ParameterJSON;
}

export default function ParameterSlider(props: Props) {
    const sliderId = createUniqueId();
    
    const matchArray = props.parameter.nickname.match(/(.+)S{(.+)}/);
    if (matchArray == null)
        return

    const groups = matchArray[2].match(/([0-9]+)\|([0-9]+)\|([0-9\.]+)/);
    if (groups == null)
        return

    const decimalPlacesGroups = groups[3].match(/([0-9]+)\.([0-9]+)/);
    var decimalPlaces = 0
    if (decimalPlacesGroups !== null)
        decimalPlaces = decimalPlacesGroups[2].toString().length

    onMount(() => {
        let slider = document.getElementById(sliderId) as any;
        noUiSlider.create(slider, {
          start: props.parameter.value,
          step: parseFloat(groups[3]),
          connect: true,
          tooltips: true,
          range: {
            min: parseFloat(groups[1]),
            max: parseFloat(groups[2])
          },
          format: wNumb({ decimals: decimalPlaces }),
        })
        slider.noUiSlider.on("change", function () { sendParameter(props.parameter.moduleid, props.parameter.name, slider.noUiSlider.get(), undefined, undefined) })
    
      })

    return (<div id={sliderId} 
        class="flex h-4 m-8 w-64 rounded-full bg-emerald-400 appearance-none transition duration-150 ease-in-out hover:scale-105 active:scale-105 hover:bg-orange-500 active:bg-orange-500 mx-auto">
        </div>);

}
