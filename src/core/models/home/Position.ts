class Position {
    x: number;
    y: number;

    constructor(config: {
        x?: number,
        y?: number
    }) {
        this.x = config.x || 0;
        this.y = config.y || 0;
    }

    static fromJson(json: Record<string, any>): Position {
        return new Position({
            x: json.x,
            y: json.y
        })

    }
}

export default Position
