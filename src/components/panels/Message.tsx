import { For, Match, Switch } from 'solid-js';
import Panel from './Panel';
import ParameterButton from '../controls/ParameterButton';
import ParameterChoice from '../controls/ParameterChoice';
import ParameterToggle from '../controls/ParameterToggle';
import ParameterTextEntry from '../controls/ParameterTextEntry';
import ParameterSlider from '../controls/ParameterSlider';

interface Props {
  message: Function;
  updatePage: Function;
}

export default function Message(props: Props) {
  function createControl(parameter: ParameterJSON) {
    return [
      <div class="inline items-center">
        <Switch>
          <Match when={parameter.type === 'BooleanP'}>
            <ParameterToggle parameter={parameter} updatePage={props.updatePage} />
          </Match>
          <Match when={parameter.type === 'ClickP'}>
            <ParameterButton parameter={parameter} updatePage={props.updatePage} />
          </Match>
          <Match
            when={
              parameter.type === 'ChoiceP' ||
              parameter.type === 'InputImageP' ||
              parameter.type === 'InputObjectsP'
            }
          >
            <ParameterChoice parameter={parameter} updatePage={props.updatePage} />
          </Match>
          <Match
            when={
              parameter.type === 'DoubleP' ||
              parameter.type == 'IntegerP' ||
              parameter.type == 'StringP'
            }
          >
            {createTextOrSliderInput(parameter)}
          </Match>
          <Match when={parameter.type === 'ParameterGroup'}>
            {createControls(parameter.collections)}
          </Match>
        </Switch>
      </div>,
    ];
  }

  function createControls(parameters: [ParameterJSON]) {
    return [<For each={parameters}>{(parameter) => createControl(parameter)}</For>];
  }

  function createTextOrSliderInput(parameter: ParameterJSON) {
    if (parameter.nickname.match(/(.+)S{(.+)}/) == null)
      return <ParameterTextEntry parameter={parameter} updatePage={props.updatePage} />;
    else return <ParameterSlider parameter={parameter} updatePage={props.updatePage} />;
  }

  return (
    <Panel class="flex-1 max-w-lg z-10">
      <div class="contents">

        {/* <div>
  <div style="display: contents;">
    <div class="inline">C1 sadsad sdfs dfsd fsd f sdf sd fsdf sd fsd fsdf sdf sadfs fsdf sdf sdf sdf sf sdf sdf Long text that wraps onto another line</div>
  </div>
  <div class="inline">C2</div>
</div> */}
        <For each={props.message()}>
          {(content) => (
            <Switch>
              <Match when={content.type === 'parameter'}>
                {createControl(content.data as ParameterJSON)}
              </Match>
              <Match when={content.type === 'text'}>
                <div
                  class="inline text-gray-600 text-2xl"
                  innerHTML={content.data as string}
                ></div>
              </Match>
            </Switch>
          )}
        </For>
      </div>
    </Panel>
  );
}
