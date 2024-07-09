type ResultJSON = {
    "message": string,
    "image": ImageJSON
}

type ImageJSON = {
    "channels": [ChannelJSON],
    "name": string,
    "showcontrols": boolean
}

type ChannelJSON = {
    "pixels": string,
    "strength": number,
    "index": number,
    "red": number,
    "green": number,
    "blue": number,
}