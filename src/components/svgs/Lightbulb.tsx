interface Props {
  svgClass?: string;
  svgStyle?: string;
  pathClass?: string;
  pathStyle?: string;
}

export default function Lightbulb(props: Props) {
  return (
    <svg
      class={`${props.svgClass ?? ''}`}
      style={props.svgStyle}
      viewBox="0 0 24 24"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="48"
      height="48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class={props.pathClass ?? ''} d="M12 1v2" id="path4" />
      <path class={props.pathClass ?? ''}  d="M 22,10.5 H 20" id="path4-3-7" />
      <path class={props.pathClass ?? ''}  d="M 19.535888,3.8916947 18.039265,5.2183895" id="path4-3-7-7" />
      <path class={props.pathClass ?? ''}  d="m 4.4641115,3.8916947 1.3266948,1.496623" id="path4-3-7-7-0" />
      <path class={props.pathClass ?? ''}  d="M 3.6905119,17.351681 5.2040385,16.044303" id="path4-3-7-7-0-6" />
      <path class={props.pathClass ?? ''}  d="M 20.309488,17.351681 18.795962,16.044303" id="path4-3-7-7-0-6-9" />
      <path class={props.pathClass ?? ''}  d="M 2.9,10.600001 H 0.89999998" id="path4-3-3" />
      <path class={props.pathClass ?? ''}  d="m 9,20.1 h 6" id="path1" />
      <path class={props.pathClass ?? ''}  d="m 10,23.1 h 4" id="path2" />
      <path class={props.pathClass ?? ''} 
        d="m 9,17.6 c 0,-2 -2.5,-3.5 -2.5,-6.5 a 5.5,5.5 0 0 1 11,0 c 0,3 -2.5,4.5 -2.5,6.5"
        id="path3"
      />
    </svg>
  );
}
