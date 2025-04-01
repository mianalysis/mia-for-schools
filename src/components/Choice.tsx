import { sendParameter } from '../lib/util';
import { Popover, PopoverButton, PopoverPanel, Transition, Menu, MenuItem } from 'terracotta';
import { For } from 'solid-js';
import type { JSX } from 'solid-js';

interface Props {
  parameter: ParameterJSON;
}

var currVal: String;

export default function Choice(props: Props) {
  return (
    <Popover defaultOpen={false} class="relative m-1 inline-block">
      {({ isOpen }): JSX.Element => (
        <>
          <PopoverButton class="range h-10 p-0 w-32 rounded-full bg-amber-500 items-center transition duration-150 ease-in-out hover:scale-110">
            {props.parameter.value}
          </PopoverButton>
          <Transition
            show={isOpen()}
            enter="transition duration-200"
            enterFrom="opacity-0 -translate-y-1 scale-50"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 -translate-y-1 scale-50"
          >
            <PopoverPanel
              unmount={false}
              class="absolute z-10 px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl"
            >
              <Menu class="overflow-hidden w-64 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white flex flex-col space-y-1 p-1">
                <For each={props.parameter.choices}>
                  {(choice) => (
                    <MenuItem
                      as="button"
                      class="p-1 text-left rounded-lg hover:bg-purple-600 hover:text-white"
                      onClick={(event: Event) => {
                        var value = (event.target as Element).innerHTML;
                        if (currVal != value) {
                          sendParameter(
                            props.parameter.moduleid,
                            props.parameter.name,
                            value,
                            props.parameter.parentGroupName,
                            props.parameter.groupCollectionNumber
                          );
                          currVal = value;
                        }
                      }}
                    >
                      {choice}
                    </MenuItem>
                  )}
                </For>
              </Menu>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
