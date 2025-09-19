import { Show } from 'solid-js';

interface Props {
  title: string;
  ismainpage: boolean;
}

export default function MenuBar(props: Props) {
  return (
    <div class="flex flex-1 items-center justify-center sm:items-stretch" style="z-index: 1">
      <Show when={!props.ismainpage}>
        <a href="./" class="flex flex-shrink-0 items-center transition duration-150 ease-in-out hover:scale-110">
          <img class="h-10 w-auto" src="/images/home-svgrepo-com.svg" alt="Go to home" />
          <h2 class="text-gray-600 ml-4 text-2xl">Select a new picture</h2>
        </a>
      </Show>
    </div>
  );
}
