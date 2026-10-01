import { ControlState } from "./Image";

interface Props {
    thisControlState: ControlState;
    iconPath: string;
    controlState: Function;
    setControlState: Function;
}

export default function ImageControlButton(props: Props) {
  return (
    <button
      id="probe_radio"
      class={`flex-none rounded-xl overflow-visible shadow-lg bg-white disabled:bg-red-500 
        opacity-40 group-hover:opacity-75 w-8 h-8 m-2 ml-0 p-0 border-0 transition 
        duration-150 ease-in-out
        ${props.controlState() === props.thisControlState ? 'button-selected' : 'button'}`}
      onclick={() => props.setControlState(props.thisControlState)}
    >
      <img class="h-6 w-6 m-1" src={props.iconPath} />
    </button>
  );
}
