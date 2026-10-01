import Panel from './Panel';

type Props = {
  class?: string;
  style?: string;
};

export default function WelcomeBar(props: Props) {
  return (
    <Panel
      class={`items-center justify-center sm:items-stretch ${props.class ?? ''}`}
      style={props.style ?? ''}
    >
      Click a picture to learn more
    </Panel>
  );
}
