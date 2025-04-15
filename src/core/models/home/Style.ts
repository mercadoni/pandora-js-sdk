import Position
    from "./Position";
import Size from "./Size";

class Style {

    position: Position;
    size: Size;

    constructor(config: {
        position: Position;
        size: Size;
    }) {
        this.position = config.position;
        this.size = config.size;
    }

    static fromJson(json: Record<string, any>): Style {
        return new Style({
            position: Position.fromJson(json.position),
            size: Size.fromJson(json.size),
        })
    }
}

export default Style;