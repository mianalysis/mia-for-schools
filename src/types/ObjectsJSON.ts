type ObjectsJSON = {
    "name": string,
    "objects": [ObjectJSON]
};

type ObjectJSON = {
    "id": string,
    "x": number[],
    "y": number[],
    "n": number
};