import WidgetData
    from "./WidgetData";
import MetaData
    from "./MetaData";
import Style from "./Style";

class HomeWidget {
    type: string
    dataSource: string
    style: Style
    metaData: MetaData
    data: WidgetData
    uuid?: string

    constructor(config: {
        type: string,
        dataSource: string,
        style: Style,
        metaData: MetaData,
        data: WidgetData,
        uuid?: string
    }) {
        this.type = config.type;
        this.dataSource = config.dataSource;
        this.style = config.style;
        this.metaData = config.metaData;
        this.data = config.data;
        this.uuid = config.uuid;
    }

}

export default HomeWidget;

