import Filter from "../../models/Filter";

class HomeFilter extends Filter {

    byPlatform(platform: string): HomeFilter {
        this.query['targetType'] = platform;
        return this;
    }

    byScreenSize(breakpoint: string): HomeFilter {
        this.query['breakpointId'] = breakpoint;
        return this;
    }

    byStore(storeReference:string): HomeFilter {
        this.query['storeReference'] = storeReference;
        return this;
    }

}

export default HomeFilter;