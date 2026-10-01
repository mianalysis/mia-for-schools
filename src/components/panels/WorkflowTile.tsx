import { Show } from 'solid-js';

interface Props {
  workflow: WorkflowJSON;
}

export default function WorkflowTile(props: Props) {
  return (
    <div class="flex hover:scale-105 animate duration-150">
      <a
        href={'./workflow?name=' + props.workflow.fullname}
        class="w-full overflow-hidden group animate-in fade-in duration-1000 ease-in-out"
        style="position:relative;text-align:center"
      >
        <div class="rounded-2xl " style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.65);">
          <img
            src={props.workflow.thumbnail}
            class="opacity-20 justify-center justify-self-center w-full max-w-lg rounded-2xl shadow-lg aspect-square content-center"
            style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75);"
          />
          {/* <div
            class="rounded-2xl opacity-80"
            style="position:absolute; top:0; left:0; width:100%; height:100%"
          /> */}
        </div>
        <Show when={props.workflow.banner}>
          <div
            class={`absolute transform -rotate-45 text-center ${props.workflow.banner.colour} text-white font-semibold py-1 left-[-42px] top-[26px] w-[170px]`}
          >
            {props.workflow.banner.text}
          </div>
        </Show>
        <div
          class={
            'text-violet-600 text-3xl drop-shadow-[0_1px_1px_rgba(0,0,0,1)]'
          }
          style="pointer-events: none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
        >
          {props.workflow.displayname}
        </div>
      </a>
    </div>
  );
}
