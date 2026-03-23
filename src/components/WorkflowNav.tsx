import { Match, Switch } from 'solid-js';

import { debounce } from '../lib/util';

interface Props {
  mode: string;
  disabled: boolean;
  updatePage: Function;
}

export default function WorkflowNav(props: Props) {
  const debouncedRequestPreviousGroup = debounce(requestPreviousGroup, 100);
  const debouncedRequestNextGroup = debounce(requestNextGroup, 100);

  async function requestPreviousGroup() {
    const processController = window.proCon;
    const response = await processController.previousGroup();
    const resultJSON: ResultJSON = JSON.parse(response);

    props.updatePage(resultJSON);
  }

  async function requestNextGroup() {
    const processController = window.proCon;
    const response = await processController.nextGroup();
    const resultJSON: ResultJSON = JSON.parse(response);

    props.updatePage(resultJSON);
  }

  return (
    <Switch>
      <Match when={props.mode === 'Previous'}>
        <button
          class="w-full h-12 rounded-full p-0 bg-violet-500 text-xl text-white border-none disabled:opacity-50 disabled:hover:bg-violet-500 transition duration-150 ease-in-out hover:scale-110 disabled:hover:scale-100 hover:bg-orange-500"
          textContent="Previous"
          onClick={() => debouncedRequestPreviousGroup()}
          disabled={props.disabled}
        />
      </Match>
      <Match when={props.mode === 'Next'}>
        <button
          class="w-full h-12 rounded-full p-0 bg-violet-500 text-xl text-white border-none disabled:opacity-50 disabled:hover:bg-violet-500 transition duration-150 ease-in-out hover:scale-110 disabled:hover:scale-100 hover:bg-orange-500"
          textContent="Next"
          onClick={() => debouncedRequestNextGroup()}
          disabled={props.disabled}
        />
      </Match>
    </Switch>
  );
}
