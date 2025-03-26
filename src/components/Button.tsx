import { sendParameter } from '../lib/util';

interface Props {
  parameter: ParameterJSON;
}

export default function Button(props: Props) {
  return (<button
    class=" h-12 w-auto rounded-full bg-cyan-500 text-white border-none disabled:opacity-50 disabled:hover:bg-violet-500 transition duration-150 ease-in-out hover:scale-110 disabled:hover:scale-100 hover:bg-orange-500"
    textContent={props.parameter.nickname}
    name="fname"
    onClick={() => sendParameter(props.parameter.moduleid, props.parameter.name, "true", props.parameter.parentGroupName, props.parameter.groupCollectionNumber)} />);

}
