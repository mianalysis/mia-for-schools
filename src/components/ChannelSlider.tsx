import { createUniqueId, onMount } from 'solid-js';
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import wNumb from "wnumb"
import BrightnessStore from './BrightnessStore';

interface Props {
    image: ImageJSON,
    channel: ChannelJSON,
    updateBC: Function
}

export default function ChannelSlider(props: Props) {
    const sliderId = createUniqueId();
    const start = BrightnessStore.hasValue(props.image.name, props.channel.index) ? BrightnessStore.getValue(props.image.name, props.channel.index)*100 : props.channel.strength*100

    onMount(() => {
        let slider = document.getElementById(sliderId);
        noUiSlider.create(slider, {
            start: start,
            step: 1,
            connect: true,
            tooltips: true,
            range: {
                min: 0,
                max: 100
            },
            format: wNumb({ decimals: 0 }),
        })
        slider.noUiSlider.on("update", function () { props.updateBC(slider.noUiSlider.get()/100, props.channel.index) })


    })
    
    return (<div id={sliderId} class="flex-initial inline-block h-4 w-32 ml-4 mr-4 mt-8 rounded-full appearance-none transition duration-150 ease-in-out hover:scale-110 active:scale-110 " style={"background: rgb(" + 3 * props.channel.red / 4 + "," + 3 * props.channel.green / 4 + "," + 3 * props.channel.blue / 4 + ");"} ></div>);

}
