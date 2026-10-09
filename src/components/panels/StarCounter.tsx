import { createSignal } from "solid-js";
import Panel from "./Panel";

interface Props {
    starCount: Function;
    setStarCount: Function
}
    
export default function StarCounter(props: Props) {
    const [rotAnimation, setRotateAnimation] = createSignal(false);

  return (
    <Panel
      class="flex mr-4 w-auto text-gray-600 text-3xl items-center !p-0 "
      // onClick={() => props.setStarCount(props.starCount()+1)}
      onClick={() => {
        setRotateAnimation(!rotAnimation());
      }}
    >
      <svg
        class={`w-8 ml-4 mr-2 !mt-0 !mb-0 ${rotAnimation() ? 'animate-spin-once' : ''}`}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class={rotAnimation() ? 'animate-colour-flash' : ''}
          d="m -12.517797,12.645528 -16.83003,-2.477213 -11.581871,12.459806 -2.844796,-16.7718108 -15.428974,-7.1647227 15.071849,-7.8883357 2.046241,-16.8878478 12.159711,11.896551 16.693621,-3.272541 -7.556735,15.2408082 z"
          transform="matrix(0.80595889,0.28307091,-0.28307091,0.80595889,50.532762,35.053601)"
          style="fill:none;stroke:#4a5565"
          stroke-width="4.35758"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <div
        class={`text-3xl mr-4 ${rotAnimation() ? 'animate-colour-flash' : ''}`}
        onAnimationEnd={() => {
          props.setStarCount(props.starCount() + 1);
          setRotateAnimation(false);
        }}
      >
        {props.starCount() < 10 ? '0' + props.starCount().toString() : props.starCount()}
      </div>
    </Panel>
  );
}
