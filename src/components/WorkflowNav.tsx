import { Match, Switch } from 'solid-js';

import { socketClient } from '../lib/client';
import { debounce } from '../lib/util';

interface Props {
  mode: string;
  disabled: boolean
}

function requestPreviousGroup() {
  socketClient.publish({
    destination: '/app/previousgroup',
    body: JSON.stringify({})
  });
}

function requestNextGroup() {
  socketClient.publish({
    destination: '/app/nextgroup',
    body: JSON.stringify({})
  });
}

export default function WorkflowNav(props: Props) {
  const debouncedRequestPreviousGroup = debounce(requestPreviousGroup, 100);
  const debouncedRequestNextGroup = debounce(requestNextGroup, 100);

  return (
    <Switch>
      <Match when={props.mode === "Previous"}>
        <button
          class="w-full h-12 rounded-full bg-violet-500 text-white border-none disabled:opacity-50 disabled:hover:bg-violet-500 transition duration-150 ease-in-out hover:scale-110 disabled:hover:scale-100 hover:bg-orange-500"
          textContent='Previous'
          onClick={() => debouncedRequestPreviousGroup()}
          disabled={props.disabled} />
      </Match>
      <Match when={props.mode === "Next"}>
        <button
          class="w-full h-12 rounded-full bg-violet-500 text-white border-none disabled:opacity-50 disabled:hover:bg-violet-500 transition duration-150 ease-in-out hover:scale-110 disabled:hover:scale-100 hover:bg-orange-500"
          textContent='Next'
          onClick={() => debouncedRequestNextGroup()}
          disabled={props.disabled} />
      </Match>
    </Switch>
  );
}
