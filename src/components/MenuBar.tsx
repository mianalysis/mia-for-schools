
interface Props {
    title: string;
}

export default function MenuBar(props: Props) {
    return (<nav class="fixed w-full top-0 left-0">
        <div class="px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <a href="./" class="flex flex-shrink-0 items-center">
                        <img class="h-8 w-auto" src="src/resources/home-svgrepo-com.svg" alt="Go to home" />
                    </a>
                    <div class="hidden sm:ml-6 sm:block items-center w-full">
                        <div class="py-2 text-lg font-medium text-white" aria-current="page">{props.title}</div>
                    </div>
                </div>                
            </div>
        </div>
    </nav>
    )
}