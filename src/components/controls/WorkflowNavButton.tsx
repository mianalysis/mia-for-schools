import Button from './Button';
import { JSX } from 'solid-js';

interface Props {
  children?: JSX.Element;
  onClick: Function;
  disabled: boolean;
  class?: string;
  style?: JSX.CSSProperties;
}

export default function WorkflowNavButton(props: Props) {
  return (
    <Button disabled={props.disabled} onClick={props.onClick} class={props.class} style={props.style}>
      {props.children}
    </Button>
  );
}
