import Input
    from "../../models/Input";
import ProductRecommendationType
    from "./ProductRecommendationType";

class GetProductRecommendationsFilter extends Input {

    constructor(config: {
        type: ProductRecommendationType;
        storeReference: string;
        data: Record<string, any>;
        cartId?: string;
    }) {
        super();
        this.query['type'] = config.type;
        this.query['storeReference'] = config.storeReference;
        this.query['data'] = config.data;
        if (config.cartId !== undefined) this.query['cartId'] = config.cartId;
    }

}

export default GetProductRecommendationsFilter;
