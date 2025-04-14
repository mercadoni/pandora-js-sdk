import Position
    from "./Position";
import Size from "./Size";

class Style {

    position: Position;
    size: Size;

    constructor(config: {
        position?: Position;
        size?: Size;
    }) {
        this.position = config.position || new Position({});
        this.size = config.size || new Size({});
    }

    static fromJson(json: Record<string, any>): Style {
        return new Style({
            position: Position.fromJson(json.position),
            size: Size.fromJson(json.size),
        })
    }
}

export default Style;