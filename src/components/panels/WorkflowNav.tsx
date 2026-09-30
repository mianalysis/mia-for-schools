import { debounce } from '../../lib/util';
import WorkflowNavButton from '../controls/WorkflowNavButton';
import Panel from './Panel';

interface Props {
  nextDisabled: boolean;
  previousDisabled: boolean;
  updatePage: Function;
}

export default function WorkflowNav(props: Props) {
  const debouncedRequestPreviousGroup = debounce(requestPreviousGroup, 100);
  const debouncedRequestNextGroup = debounce(requestNextGroup, 100);

  async function requestPreviousGroup() {
    const processController = window.proCon;
    const result = await processController.previousGroup();

    props.updatePage(result);
  }

  async function requestNextGroup() {
    const processController = window.proCon;
    const result = await processController.nextGroup();

    await props.updatePage(result);
  }

  return (
    <Panel class="flex m-auto grid grid-cols-2 gap-4 w-full mt-4 ">
      <WorkflowNavButton
        disabled={props.previousDisabled}
        onClick={requestPreviousGroup}
        class="flex-1 col-start-1"
      >
        Previous
      </WorkflowNavButton>
      <WorkflowNavButton
        disabled={props.nextDisabled}
        onClick={requestNextGroup}
        class="flex-1 col-start-2"
      >
        Next
      </WorkflowNavButton>
    </Panel>
  );
}
