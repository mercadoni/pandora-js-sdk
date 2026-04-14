import Banner from "./Banner";

class Carousel {

    id: string
    name: string
    autoplaySpeed: number
    lazyLoading: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
    bannersIds: Array<string>
    banners: Array<Banner>


    constructor(config: {
        id: string,
        name: string,
        autoplaySpeed: number,
        lazyLoading: boolean,
        isActive: boolean,
        createdAt: string,
        updatedAt: string,
        bannersIds: Array<string>,
        banners: Array<Banner>
    }) {

        this.id = config.id;
        this.name = config.name;
        this.autoplaySpeed = config.autoplaySpeed;
        this.lazyLoading = config.lazyLoading;
        this.isActive = config.isActive;
        this.createdAt = config.createdAt;
        this.updatedAt = config.updatedAt;
        this.bannersIds = config.bannersIds;
        this.banners = config.banners;
    }

    static fromJson(json: Record<string, any>): Carousel {

        return new Carousel({
            id: json.id || '',
            name: json.name || '',
            autoplaySpeed: json.autoplaySpeed,
            lazyLoading: json.lazyLoading,
            isActive: json.isActive,
            createdAt: json.createdAt || '',
            updatedAt: json.updatedAt || '',
            bannersIds: json.bannersIds || '',
            banners: Array.isArray(json.banners) ? json.banners.map((banner) => Banner.fromJson(banner)) : [],
        })
    }

}

export default Carousel;