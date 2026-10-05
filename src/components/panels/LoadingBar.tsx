import Panel from '../panels/Panel';

type Props = {
  class?: string;
  style?: string;
  startingBytes: number;
  finalBytes: number;
  loadedBytes: Function;
};

export default function LoadingBar(props: Props) {
  return (
    <Panel class={`fade-out w-64 ${props.class ?? ""}`} style={props.style ?? ""}>
      <div class="text-3xl text-gray-600">Loading...</div>
      <div class="w-full bg-neutral-quaternary rounded-full">
        <div
          class="mt-4 bg-violet-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full h-4 flex items-center justify-center"
          style={
            'width: ' +
            Math.max(
              10,
              Math.min(100, 100 * ((props.loadedBytes() - props.startingBytes) / props.finalBytes))
            ) +
            '%'
          }
        ></div>
      </div>
    </Panel>
  );
}
