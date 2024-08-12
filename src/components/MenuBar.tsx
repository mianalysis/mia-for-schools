import { Show } from 'solid-js';

interface Props {
    title: string;
    ismainpage: boolean
}

export default function MenuBar(props: Props) {

    return (<nav class="w-full top-0 left-0">
        <div class="px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="flex flex-1 items-center justify-center sm:items-stretch">
                    <Show when={!props.ismainpage}>
                        <a href="./" class="flex flex-shrink-0 items-center">
                            <img class="h-8 w-auto" src='/images/home-svgrepo-com.svg' alt="Go to home" />
                            <h2 class="text-white m-4 text-2xl">Select a new picture</h2>
                        </a>
                    </Show>
                </div>
            </div>
        </div>
    </nav>
    )
}