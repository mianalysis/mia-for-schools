import WorkflowTileStars from './WorkflowTileStars';

interface Props {
  workflow: WorkflowJSON;
}

export default function WorkflowTile(props: Props) {
  const stars = Array(props.workflow.totalStars).fill(false);
  for (var i=0;i<window.starCount.get(props.workflow.fullname);i++)
    stars[i] = true;
  
  return (
    <div class="flex hover:scale-105 animate duration-150">
      <a
        href={'./workflow?name=' + props.workflow.fullname}
        class="relative text-center w-full overflow-hidden group animate-in fade-in duration-1000 ease-in-out"
      >
        <div
          class="rounded-2xl "
          style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.65);"
        >
          <img
            src={props.workflow.thumbnail}
            class="opacity-20 justify-center justify-self-center w-full max-w-lg rounded-2xl shadow-lg aspect-square content-center"
            style="backdrop-filter: blur(6px); background-color: rgba(255,255,255,0.75);"
          />
        </div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[pixel] text-violet-600 text-3xl drop-shadow-[0_1px_1px_rgba(0,0,0,1)]"
        >
          {props.workflow.displayname}
        </div>
        <WorkflowTileStars stars={stars} class='absolute flex w-full bottom-1/26 justify-center'/>
      </a>
    </div>
  );
}
