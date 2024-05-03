type ResultJSON = {
    "message": string,
    "image": ImageJSON
    "showimagecontrols": boolean
}

type ImageJSON = {
    "name": string,
    "channels": [ChannelJSON]
}

type ChannelJSON = {
    "pixels": string,
    "strength": number,
    "index": number,
    "red": number,
    "green": number,
    "blue": number,
}