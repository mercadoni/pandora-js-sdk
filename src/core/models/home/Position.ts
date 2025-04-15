class Position {
    x: number;
    y: number;

    constructor(config: {
        x: number,
        y: number
    }) {
        this.x = config.x;
        this.y = config.y;
    }

    static fromJson(json: Record<string, any>): Position {
        return new Position({
            x: json.x || 0,
            y: json.y || 0
        })

    }
}

export default Position
