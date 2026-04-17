class WidgetData {
    items: Array<any> = [];
    link?: { url: string; text: string };
    src?: string;
    content?: string;

    constructor(config: {
        items: Array<any>;
        link?: { url: string; text: string };
        src?: string;
        content?: string;
    }) {
        this.items = config.items;
        this.link = config.link;
        this.src = config.src;
        this.content = config.content;
    }

    static fromJson(json: Record<string, any>): WidgetData {
        return new WidgetData({items: []});
    }
}

export default WidgetData;