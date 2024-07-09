export default class BrightnessStore extends Map<string, Map<number, number>> {
    // Stores set brightnesses for each image name
    public static values = new Map<string, Map<number, number>>() 

    public static updateChannelsJSON(name: string, channels: [ChannelJSON]) {
        var currValues = BrightnessStore.values.get(name);
          if (currValues == undefined)
            return

          for (let c = 0; c < channels.length; c++)
            channels[c].strength = currValues.get(c)!;

    }

    public static addNewValues(name: string, channels: [ChannelJSON]) {
        // Setting each channel value from incoming props
        var currValues = new Map<number, number>()
        for (let c = 0; c < channels.length; c++)
          currValues.set(c, channels[c].strength)

        BrightnessStore.values.set(name, currValues)

    }

    public static updateValue(name: string, channel: number, value: number) {
        BrightnessStore.values.get(name)?.set(channel, value)
    
    }

    public static hasValue(name: string, channel: number) {
        if (!BrightnessStore.values.has(name))
                return false

        return BrightnessStore.values.get(name)?.has(channel)

    }

    public static getValue(name: string, channel: number) {
        return BrightnessStore.values.get(name)?.get(channel)
        
    }
  }