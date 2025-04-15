class Size {

    height: number;
    width: number;

    constructor(config: {
        height: number,
        width: number
    }) {
        this.width = config.width
        this.height = config.height
    }

    static fromJson(json: Record<string, any>): Size {
        return new Size({
            height: json.height || 0,
            width: json.width || 0,
        })
    }

}

export default Size;