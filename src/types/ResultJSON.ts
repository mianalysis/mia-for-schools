type ResultJSON = {
    "message": string,
    "image": [ChannelJSON],
    "showimagecontrols": boolean
}

type ChannelJSON = {
    "pixels": string,
    "strength": number,
    "reds": Uint8Array,
    "greens": Uint8Array,
    "blues": Uint8Array,
}