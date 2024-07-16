import { Show } from 'solid-js';

interface Props {
    title: string;
    ismainpage: boolean
}

export default function MenuBar(props: Props) {
    // const displayTitle: string = props.title.replace("_", " ").replace("$Q", "?");

    return (<nav class="fixed w-full top-0 left-0">
        <div class="px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <Show when={!props.ismainpage}>
                        <a href="./" class="flex flex-shrink-0 items-center">
                            <img class="h-8 w-auto" src="./src/resources/home-svgrepo-com.svg" alt="Go to home" />
                            <h2 class="text-white m-4 text-2xl">Select new image</h2>
                        </a>
                    </Show>
                    {/* <div class="hidden sm:ml-6 sm:block items-center w-full">
                        <div class="py-2 text-2xl font-medium text-white" aria-current="page">{displayTitle}</div>
                    </div> */}
                </div>
            </div>
        </div>
    </nav>
    )
}