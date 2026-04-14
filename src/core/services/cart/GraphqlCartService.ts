import CartService from './CartService';
import GraphqlClient from '../../http/GraphqlClient';
import GetActiveCartFilter from './GetActiveCartFilter';
import CreateCartFilter from './CreateCartFilter';
import UpdateCartFilter from './UpdateCartFilter';
import AddProductFilter from './AddProductFilter';
import AddProductsFilter from './AddProductsFilter';
import UpdateProductFilter from './UpdateProductFilter';
import RemoveProductFilter from './RemoveProductFilter';
import ValidateCartFilter from './ValidateCartFilter';
import PurchaseCartFilter from './PurchaseCartFilter';
import CouponFilter from './CouponFilter';
import Cart from '../../models/cart/Cart';
import ValidatedCart from '../../models/cart/ValidatedCart';
import Purchase from '../../models/cart/Purchase';
import getEcommerceCartQuery from './queries/GetEcommerceCartQuery';
import getActiveEcommerceCartQuery from './queries/GetActiveEcommerceCartQuery';
import createCartMutation from './mutations/CreateCartMutation';
import getOrCreateCartMutation from './mutations/GetOrCreateCartMutation';
import updateCartMutation from './mutations/UpdateCartMutation';
import deleteCartMutation from './mutations/DeleteCartMutation';
import addProductMutation from './mutations/AddProductMutation';
import addProductsMutation from './mutations/AddProductsMutation';
import updateProductMutation from './mutations/UpdateProductMutation';
import removeProductMutation from './mutations/RemoveProductMutation';
import validateCartMutation from './mutations/ValidateCartMutation';
import purchaseCartMutation from './mutations/PurchaseCartMutation';
import updateCouponMutation from './mutations/UpdateCouponMutation';

class GraphqlCartService implements CartService {

    constructor(private readonly client: GraphqlClient) {}

    async getCart(cartId: string): Promise<Cart> {
        const response = await this.client.query(getEcommerceCartQuery, { cartId });
        if (response.data?.getEcommerceCart) {
            return Cart.fromJson(response.data.getEcommerceCart);
        }
        throw new Error(`Failed to get cart: ${JSON.stringify(response.errors || response)}`);
    }

    async getActiveCart(filter: GetActiveCartFilter): Promise<Cart> {
        const response = await this.client.query(getActiveEcommerceCartQuery, { getActiveCartInput: filter.query });
        if (response.data?.getActiveEcommerceCart) {
            return Cart.fromJson(response.data.getActiveEcommerceCart);
        }
        throw new Error(`Failed to get active cart: ${JSON.stringify(response.errors || response)}`);
    }

    async createCart(filter: CreateCartFilter): Promise<Cart> {
        const response = await this.client.mutation(createCartMutation, { createCartInput: filter.query });
        if (response.data?.createEcommerceCart) {
            return Cart.fromJson(response.data.createEcommerceCart);
        }
        throw new Error(`Failed to create cart: ${JSON.stringify(response.errors || response)}`);
    }

    async getOrCreateCart(filter: CreateCartFilter): Promise<Cart> {
        const response = await this.client.mutation(getOrCreateCartMutation, { createCartInput: filter.query });
        if (response.data?.getActiveOrCreateEcommerceCart) {
            return Cart.fromJson(response.data.getActiveOrCreateEcommerceCart);
        }
        throw new Error(`Failed to get or create cart: ${JSON.stringify(response.errors || response)}`);
    }

    async updateCart(filter: UpdateCartFilter): Promise<Cart> {
        const response = await this.client.mutation(updateCartMutation, { updateCartInput: filter.query });
        if (response.data?.updateEcommerceCart) {
            return Cart.fromJson(response.data.updateEcommerceCart);
        }
        throw new Error(`Failed to update cart: ${JSON.stringify(response.errors || response)}`);
    }

    async deleteCart(cartId: string): Promise<Cart> {
        const response = await this.client.mutation(deleteCartMutation, { cartId });
        if (response.data?.deleteEcommerceCart) {
            return Cart.fromJson(response.data.deleteEcommerceCart);
        }
        throw new Error(`Failed to delete cart: ${JSON.stringify(response.errors || response)}`);
    }

    async addProduct(filter: AddProductFilter): Promise<Cart> {
        const response = await this.client.mutation(addProductMutation, { addProductToCartInput: filter.query });
        if (response.data?.addProductToEcommerceCart) {
            return Cart.fromJson(response.data.addProductToEcommerceCart);
        }
        throw new Error(`Failed to add product to cart: ${JSON.stringify(response.errors || response)}`);
    }

    async addProducts(filter: AddProductsFilter): Promise<{ cart: Cart; confirmationStatuses: Array<Record<string, any>> }> {
        const response = await this.client.mutation(addProductsMutation, { addProductsToCartInput: filter.query });
        if (response.data?.addProductsToEcommerceCart) {
            const data = response.data.addProductsToEcommerceCart;
            return {
                cart: Cart.fromJson(data.cart),
                confirmationStatuses: data.confirmationStatuses || [],
            };
        }
        throw new Error(`Failed to add products to cart: ${JSON.stringify(response.errors || response)}`);
    }

    async updateProduct(filter: UpdateProductFilter): Promise<Cart> {
        const response = await this.client.mutation(updateProductMutation, { updateProductInCartInput: filter.query });
        if (response.data?.updateProductInEcommerceCart) {
            return Cart.fromJson(response.data.updateProductInEcommerceCart);
        }
        throw new Error(`Failed to update product in cart: ${JSON.stringify(response.errors || response)}`);
    }

    async removeProduct(filter: RemoveProductFilter): Promise<Cart> {
        const response = await this.client.mutation(removeProductMutation, { deleteProductInCartInput: filter.query });
        if (response.data?.deleteProductInEcommerceCart) {
            return Cart.fromJson(response.data.deleteProductInEcommerceCart);
        }
        throw new Error(`Failed to remove product from cart: ${JSON.stringify(response.errors || response)}`);
    }

    async validateCart(filter: ValidateCartFilter): Promise<ValidatedCart> {
        const variables: Record<string, any> = { cartId: filter.query['cartId'] };
        if (filter.query['allowSplitOrders'] !== undefined) {
            variables['allowSplitOrders'] = filter.query['allowSplitOrders'];
        }
        const response = await this.client.mutation(validateCartMutation, variables);
        if (response.data?.validateEcommerceCart) {
            return ValidatedCart.fromJson(response.data.validateEcommerceCart);
        }
        throw new Error(`Failed to validate cart: ${JSON.stringify(response.errors || response)}`);
    }

    async purchaseCart(filter: PurchaseCartFilter): Promise<Purchase> {
        const response = await this.client.mutation(purchaseCartMutation, { purchaseCartInput: filter.query });
        if (response.data?.purchaseEcommerceCart) {
            return Purchase.fromJson(response.data.purchaseEcommerceCart);
        }
        throw new Error(`Failed to purchase cart: ${JSON.stringify(response.errors || response)}`);
    }

    async applyCoupon(filter: CouponFilter): Promise<ValidatedCart> {
        const response = await this.client.mutation(updateCouponMutation, { updateCouponInput: filter.query });
        if (response.data?.updateCouponInEcommerceCart) {
            return ValidatedCart.fromJson(response.data.updateCouponInEcommerceCart);
        }
        throw new Error(`Failed to apply coupon: ${JSON.stringify(response.errors || response)}`);
    }
}

export default GraphqlCartService;
