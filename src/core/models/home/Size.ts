class Size {

    height: number;
    width: number;

    constructor(config: {
        height?: number,
        width?: number
    }) {
        this.width = config.width || 0
        this.height = config.height || 0
    }

    static fromJson(json: Record<string, any>): Size {
        return new Size({
            height: json.height,
            width: json.width,
        })
    }

}

export default Size;