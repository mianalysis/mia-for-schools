import { sendParameter } from '../lib/util';

interface Props {
  parameter: ParameterJSON;
}

export default function Toggle(props: Props) {
  return (
    <input
      class="h-10 w-10 rounded-full bg-emerald-300 transition duration-150 ease-in-out hover:scale-110"
      type="checkbox"
      name="fname"
      checked={props.parameter.value === 'true'}
      onClick={(e) =>
        sendParameter(
          props.parameter.moduleid,
          props.parameter.name,
          Boolean((e.target as HTMLInputElement).checked).toString(),
          props.parameter.parentGroupName,
          props.parameter.groupCollectionNumber
        )
      }
    />
  );
}
