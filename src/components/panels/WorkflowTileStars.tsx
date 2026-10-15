import { For } from 'solid-js';
import Star from '../svgs/Star';

interface Props {
  stars: Array<boolean>;
  class?: string;
  style?: string;
}

export default function WorkflowTileStars(props: Props) {
  return (
    <div class={`gap-2 ${props.class ?? ''}`}>
      <For each={props.stars}>
        {(star) => (
          <Star
          svgClass='w-6 md:w-8'
            pathStyle={`fill: ${star ? 'oklch(96.2% 0.059 95.617)' : 'none'}; stroke: ${star ? 'oklch(75% 0.183 55.934)' : '#4a556581'}`}
          />
        )}
      </For>
    </div>
  );
}
// stroke: oklch(75% 0.183 55.934);
//       fill: oklch(96.2% 0.059 95.617);
