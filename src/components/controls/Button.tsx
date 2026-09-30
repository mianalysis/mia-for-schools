import { JSX } from 'solid-js';

interface Props {
  children: JSX.Element;
  class?: string;
  disabled?: boolean;
  onClick?: Function;
  style?: JSX.CSSProperties;
}

export default function Button(props: Props) {
  return (
    <button
      class={`w-full h-12 rounded-full p-0 bg-violet-500 text-xl text-white border-none 
        disabled:opacity-50 disabled:hover:bg-violet-500 transition duration-150 ease-in-out 
        hover:scale-110 disabled:hover:scale-100 hover:bg-orange-500 ${props.class ?? ''}`}
      style={`${props.style ?? ''}`}
      onClick={() => props.onClick()}
      disabled={props.disabled ?? false}
    >
      {props.children}
    </button>
  );
}
