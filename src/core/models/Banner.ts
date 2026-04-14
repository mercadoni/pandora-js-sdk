class Banner {
    id: string;
    name: string;
    webImageUrl: string;
    tabletImageUrl: string;
    appImageUrl: string;
    redirectUrl: string;
    redirectMode: string;
    isActive: boolean;

    constructor(config: {
        id: string,
        name: string,
        webImageUrl: string,
        tabletImageUrl: string,
        appImageUrl: string,
        redirectUrl: string,
        redirectMode: string,
        isActive: boolean
    }) {

        this.id = config.id
        this.name = config.name
        this.webImageUrl = config.webImageUrl
        this.tabletImageUrl = config.tabletImageUrl
        this.appImageUrl = config.appImageUrl
        this.redirectUrl = config.redirectUrl
        this.redirectMode = config.redirectMode
        this.isActive = config.isActive
    }

    static fromJson(json: Record<string, any>): Banner {
        return new Banner({
            id: json.id || '',
            name: json.name || '',
            webImageUrl: json.webImageUrl || '',
            tabletImageUrl: json.tabletImageUrl || '',
            appImageUrl: json.appImageUrl || '',
            redirectUrl: json.redirectUrl || '',
            redirectMode: json.redirectMode || '',
            isActive: json.isActive,
        })

    }
}

export default Banner;