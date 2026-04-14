class WidgetData {
    items: Array<any> = [];

    constructor(config: {
        items: Array<any>
    }) {
        this.items = config.items;
    }

    static fromJson(json: Record<string, any>): WidgetData {
        return new WidgetData({items: []})
    }
}

export default WidgetData;