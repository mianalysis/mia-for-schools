interface Props {
  svgClass?: string;
  svgStyle?: string;
  pathClass?: string;
  pathStyle?: string;
}

export default function Star(props: Props) {
    return (
        <svg
        class={`w-8 ${props.svgClass ?? ""}`}
        style={props.svgStyle}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class={props.pathClass ?? ""}
          d="m -12.517797,12.645528 -16.83003,-2.477213 -11.581871,12.459806 -2.844796,-16.7718108 -15.428974,-7.1647227 15.071849,-7.8883357 2.046241,-16.8878478 12.159711,11.896551 16.693621,-3.272541 -7.556735,15.2408082 z"
          transform="matrix(0.80595889,0.28307091,-0.28307091,0.80595889,50.532762,35.053601)"
          style={`${props.pathStyle ?? ""}`}
          stroke-width="4.35758"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
}