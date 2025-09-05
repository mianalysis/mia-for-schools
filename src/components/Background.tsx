import { For } from "solid-js";

interface Props {
    backgroundJSON: BackgroundJSON;
    n: number;
}

function pickItems(items: string[], n: number) {
    const picked_items: string[] = [];

    for (let i = 0; i < n; i++) {
        var idx = Math.floor(Math.random() * items.length);
        picked_items.push(items[idx]);
    }

    return picked_items;

}

function randomPath(maxX: number, maxY: number) {
    var x0 = Math.random() * maxX;
    var y0 = Math.random() * maxY;
    var x1 = Math.random() * maxX;
    var y1 = Math.random() * maxY;
    var x2 = Math.random() * maxX;
    var y2 = Math.random() * maxY;
    var x3 = Math.random() * maxX;
    var y3 = Math.random() * maxY;

    // Overwriting one of the start and end positions, so they're on the image edge
    const edge1 = Math.floor(Math.random() * 4);
    switch (edge1) {
        case 0: {
            x0 = 0;
            break;
        }
        case 1: {
            y0 = 0;
            break;
        }
        case 2: {
            x0 = maxX;
            break;
        }
        case 3: {
            y0 = maxY;
            break;
        }
    }

    const edge2 = Math.floor(Math.random() * 4);
    switch (edge2) {
        case 0: {
            x3 = 0;
            break;
        }
        case 1: {
            y3 = 0;
            break;
        }
        case 2: {
            x3 = maxX;
            break;
        }
        case 3: {
            y3 = maxY;
            break;
        }
    }

    return `path("M${x0},${y0} C${x1},${y1} ${x2},${y2} ${x3},${y3}")`;

}

export function getDefaultBackground() {
    const default_items: BackgroundJSON = {
        colour: "#56afca",

        iconPaths: ["images/background/square_sm.png",
            "images/background/square_md.png",
            "images/background/square_lg.png",
            "images/background/cross.png",
            "images/background/circle.png"]

    };

    return default_items;

}

export default function Background(props: Props) {
    if (props.backgroundJSON == undefined)
        props.backgroundJSON = getDefaultBackground();

    const items = pickItems(props.backgroundJSON.iconPaths, props.n);
    document.body.style.background = `${props.backgroundJSON.colour}`;

    return (
        <div class="background" >
            <For each={items}>
                {(src) => {
                    const path = randomPath(window.innerWidth, window.innerHeight);
                    return (
                        <img class="bg-item animate-in fade-in duration-1000"
                            src={src}
                            style={{
                                "offset-path": path,
                                "animation-duration": `${600 + Math.random() * 300}s`,
                                "animation-delay": `${-Math.random() * 5000}s`
                            }} />
                    )
                }
                }
            </For>
        </div>
    );
}