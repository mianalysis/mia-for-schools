import { sendParameter } from '../lib/util';

interface Props {
  parameter: ParameterJSON;
  updatePage: Function;
}

export default function TextEntry(props: Props) {
  return (
    <input
      class="h-10 m-1 text-xl w-auto rounded-full bg-rose-500 text-white hover:shadow-md transition duration-150 ease-in-out hover:scale-110"
      type="text"
      name="fname"
      value={props.parameter.value}
      onFocusOut={(e) =>
        sendParameter(
          props.parameter.moduleid,
          props.parameter.name,
          (e.target as HTMLInputElement).value,
          props.parameter.parentGroupName,
          props.parameter.groupCollectionNumber,
          props.updatePage
        )
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter')
          sendParameter(
            props.parameter.moduleid,
            props.parameter.name,
            (e.target as HTMLInputElement).value,
            props.parameter.parentGroupName,
            props.parameter.groupCollectionNumber,
            props.updatePage
          );
      }}
      style="text-align:center"
    />
  );
}
