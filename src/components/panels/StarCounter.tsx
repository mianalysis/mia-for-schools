import { Accessor, createEffect, createSignal, on, Setter } from 'solid-js';
import Panel from './Panel';
import Star from '../svgs/Star';

interface Props {
  class?: string;
  style?: string;
  starCount: Accessor<number>;
  setStarCount: Setter<number>;
}

export default function StarCounter(props: Props) {
  const [rotAnimation, setRotateAnimation] = createSignal(false);

  createEffect(on(props.starCount, () => setRotateAnimation(true), { defer: true }));

  return (
    <Panel
      class={`flex w-auto text-gray-600 text-3xl items-center !p-0 ${props.class ?? ''}`}
      style={props.style ?? ''}
    >
      <Star svgClass={`ml-4 mr-2 !mt-0 !mb-0 ${rotAnimation() ? 'animate-spin-once' : ''}`} pathClass={rotAnimation() ? 'animate-colour-flash' : ''} pathStyle='fill:none;stroke:#4a5565'/>

      <div
        class={`text-3xl mr-4 ${rotAnimation() ? 'animate-colour-flash ' : ''}`}
        onAnimationEnd={() => {
          setRotateAnimation(false);
        }}
      >
        {props.starCount() < 10 ? '0' + props.starCount().toString() : props.starCount()}
      </div>
    </Panel>
  );
}
