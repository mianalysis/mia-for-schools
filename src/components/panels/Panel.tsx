import { JSX } from 'solid-js';

type Props = {
  children: JSX.Element;
  class?: string;
  style?: string;
  onClick?: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>;
};

export default function Panel(props: Props) {
  return (
    <div
      class={`rounded-2xl shadow-lg p-4 animate-in fade-in duration-1000 ease-in-out ${props.class ?? ""}`}
      style={`backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75); ${props.style ?? ""}`}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}
