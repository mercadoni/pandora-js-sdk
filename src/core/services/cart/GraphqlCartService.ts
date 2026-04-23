import CartService from './CartService';
import GraphqlClient from '../../http/GraphqlClient';
import GetActiveCartFilter from './GetActiveCartFilter';
import CreateCartInput from './CreateCartInput';
import UpdateCartInput from './UpdateCartInput';
import AddProductInput from './AddProductInput';
import AddProductsInput from './AddProductsInput';
import UpdateProductInput from './UpdateProductInput';
import RemoveProductInput from './RemoveProductInput';
import ValidateCartInput from './ValidateCartInput';
import PurchaseCartInput from './PurchaseCartInput';
import CouponInput from './CouponInput';
import CreateGuestCartInput from './CreateGuestCartInput';
import GetGuestCartFilter from './GetGuestCartFilter';
import UpdateGuestCartInput from './UpdateGuestCartInput';
import AddProductToGuestCartInput from './AddProductToGuestCartInput';
import UpdateProductInGuestCartInput from './UpdateProductInGuestCartInput';
import DeleteProductInGuestCartInput from './DeleteProductInGuestCartInput';
import ValidateGuestCartInput from './ValidateGuestCartInput';
import ConvertGuestCartInput from './ConvertGuestCartInput';
import Cart from '../../models/cart/Cart';
import ValidatedCart from '../../models/cart/ValidatedCart';
import Purchase from '../../models/cart/Purchase';
import getEcommerceCartQuery from './queries/GetEcommerceCartQuery';
import getActiveEcommerceCartQuery from './queries/GetActiveEcommerceCartQuery';
import getGuestCartQuery from './queries/GetGuestCartQuery';
import createCartMutation from './mutations/CreateCartMutation';
import createGuestCartMutation from './mutations/CreateGuestCartMutation';
import getOrCreateCartMutation from './mutations/GetOrCreateCartMutation';
import updateCartMutation from './mutations/UpdateCartMutation';
import updateGuestCartMutation from './mutations/UpdateGuestCartMutation';
import deleteCartMutation from './mutations/DeleteCartMutation';
import addProductMutation from './mutations/AddProductMutation';
import addProductsMutation from './mutations/AddProductsMutation';
import addProductToGuestCartMutation from './mutations/AddProductToGuestCartMutation';
import updateProductMutation from './mutations/UpdateProductMutation';
import updateProductInGuestCartMutation from './mutations/UpdateProductInGuestCartMutation';
import removeProductMutation from './mutations/RemoveProductMutation';
import deleteProductInGuestCartMutation from './mutations/DeleteProductInGuestCartMutation';
import validateCartMutation from './mutations/ValidateCartMutation';
import validateGuestCartMutation from './mutations/ValidateGuestCartMutation';
import purchaseCartMutation from './mutations/PurchaseCartMutation';
import updateCouponMutation from './mutations/UpdateCouponMutation';
import convertGuestToEcommerceCartMutation from './mutations/ConvertGuestToEcommerceCartMutation';

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

    async createCart(input: CreateCartInput): Promise<Cart> {
        const response = await this.client.mutation(createCartMutation, { createCartInput: input.query });
        if (response.data?.createEcommerceCart) {
            return Cart.fromJson(response.data.createEcommerceCart);
        }
        throw new Error(`Failed to create cart: ${JSON.stringify(response.errors || response)}`);
    }

    async createGuestCart(input: CreateGuestCartInput): Promise<Cart> {
        const response = await this.client.mutation(createGuestCartMutation, { createCartInput: input.query });
        if (response.data?.createGuestCart) {
            return Cart.fromJson(response.data.createGuestCart);
        }
        throw new Error(`Failed to create guest cart: ${JSON.stringify(response.errors || response)}`);
    }

    async getGuestCart(filter: GetGuestCartFilter): Promise<Cart> {
        const response = await this.client.query(getGuestCartQuery, { cartId: filter.query['cartId'] });
        if (response.data?.getGuestCart) {
            return Cart.fromJson(response.data.getGuestCart);
        }
        throw new Error(`Failed to get guest cart: ${JSON.stringify(response.errors || response)}`);
    }

    async getOrCreateCart(input: CreateCartInput): Promise<Cart> {
        const response = await this.client.mutation(getOrCreateCartMutation, { createCartInput: input.query });
        if (response.data?.getActiveOrCreateEcommerceCart) {
            return Cart.fromJson(response.data.getActiveOrCreateEcommerceCart);
        }
        throw new Error(`Failed to get or create cart: ${JSON.stringify(response.errors || response)}`);
    }

    async updateCart(input: UpdateCartInput): Promise<Cart> {
        const response = await this.client.mutation(updateCartMutation, { updateCartInput: input.query });
        if (response.data?.updateEcommerceCart) {
            return Cart.fromJson(response.data.updateEcommerceCart);
        }
        throw new Error(`Failed to update cart: ${JSON.stringify(response.errors || response)}`);
    }

    async updateGuestCart(input: UpdateGuestCartInput): Promise<Cart> {
        const response = await this.client.mutation(updateGuestCartMutation, { updateCartInput: input.query });
        if (response.data?.updateGuestCart) {
            return Cart.fromJson(response.data.updateGuestCart);
        }
        throw new Error(`Failed to update guest cart: ${JSON.stringify(response.errors || response)}`);
    }

    async deleteCart(cartId: string): Promise<Cart> {
        const response = await this.client.mutation(deleteCartMutation, { cartId });
        if (response.data?.deleteEcommerceCart) {
            return Cart.fromJson(response.data.deleteEcommerceCart);
        }
        throw new Error(`Failed to delete cart: ${JSON.stringify(response.errors || response)}`);
    }

    async addProduct(input: AddProductInput): Promise<Cart> {
        const response = await this.client.mutation(addProductMutation, { addProductToCartInput: input.query });
        if (response.data?.addProductToEcommerceCart) {
            return Cart.fromJson(response.data.addProductToEcommerceCart);
        }
        throw new Error(`Failed to add product to cart: ${JSON.stringify(response.errors || response)}`);
    }

    async addProductToGuestCart(input: AddProductToGuestCartInput): Promise<Cart> {
        const response = await this.client.mutation(addProductToGuestCartMutation, { addProductToCartInput: input.query });
        if (response.data?.addProductToGuestCart) {
            return Cart.fromJson(response.data.addProductToGuestCart);
        }
        throw new Error(`Failed to add product to guest cart: ${JSON.stringify(response.errors || response)}`);
    }

    async addProducts(input: AddProductsInput): Promise<{ cart: Cart; confirmationStatuses: Array<Record<string, any>> }> {
        const response = await this.client.mutation(addProductsMutation, { addProductsToCartInput: input.query });
        if (response.data?.addProductsToEcommerceCart) {
            const data = response.data.addProductsToEcommerceCart;
            return {
                cart: Cart.fromJson(data.cart),
                confirmationStatuses: data.confirmationStatuses || [],
            };
        }
        throw new Error(`Failed to add products to cart: ${JSON.stringify(response.errors || response)}`);
    }

    async updateProduct(input: UpdateProductInput): Promise<Cart> {
        const response = await this.client.mutation(updateProductMutation, { updateProductInCartInput: input.query });
        if (response.data?.updateProductInEcommerceCart) {
            return Cart.fromJson(response.data.updateProductInEcommerceCart);
        }
        throw new Error(`Failed to update product in cart: ${JSON.stringify(response.errors || response)}`);
    }

    async updateProductInGuestCart(input: UpdateProductInGuestCartInput): Promise<Cart> {
        const response = await this.client.mutation(updateProductInGuestCartMutation, { updateProductInCartInput: input.query });
        if (response.data?.updateProductInGuestCart) {
            return Cart.fromJson(response.data.updateProductInGuestCart);
        }
        throw new Error(`Failed to update product in guest cart: ${JSON.stringify(response.errors || response)}`);
    }

    async removeProduct(input: RemoveProductInput): Promise<Cart> {
        const response = await this.client.mutation(removeProductMutation, { deleteProductInCartInput: input.query });
        if (response.data?.deleteProductInEcommerceCart) {
            return Cart.fromJson(response.data.deleteProductInEcommerceCart);
        }
        throw new Error(`Failed to remove product from cart: ${JSON.stringify(response.errors || response)}`);
    }

    async deleteProductInGuestCart(input: DeleteProductInGuestCartInput): Promise<Cart> {
        const response = await this.client.mutation(deleteProductInGuestCartMutation, { deleteProductInCartInput: input.query });
        if (response.data?.deleteProductInGuestCart) {
            return Cart.fromJson(response.data.deleteProductInGuestCart);
        }
        throw new Error(`Failed to delete product in guest cart: ${JSON.stringify(response.errors || response)}`);
    }

    async validateCart(input: ValidateCartInput): Promise<ValidatedCart> {
        const variables: Record<string, any> = { cartId: input.query['cartId'] };
        if (input.query['allowSplitOrders'] !== undefined) {
            variables['allowSplitOrders'] = input.query['allowSplitOrders'];
        }
        const response = await this.client.mutation(validateCartMutation, variables);
        if (response.data?.validateEcommerceCart) {
            return ValidatedCart.fromJson(response.data.validateEcommerceCart);
        }
        throw new Error(`Failed to validate cart: ${JSON.stringify(response.errors || response)}`);
    }

    async purchaseCart(input: PurchaseCartInput): Promise<Purchase> {
        const response = await this.client.mutation(purchaseCartMutation, { purchaseCartInput: input.query });
        if (response.data?.purchaseEcommerceCart) {
            return Purchase.fromJson(response.data.purchaseEcommerceCart);
        }
        throw new Error(`Failed to purchase cart: ${JSON.stringify(response.errors || response)}`);
    }

    async applyCoupon(input: CouponInput): Promise<ValidatedCart> {
        const response = await this.client.mutation(updateCouponMutation, { updateCouponInput: input.query });
        if (response.data?.updateCouponInEcommerceCart) {
            return ValidatedCart.fromJson(response.data.updateCouponInEcommerceCart);
        }
        throw new Error(`Failed to apply coupon: ${JSON.stringify(response.errors || response)}`);
    }

    async validateGuestCart(input: ValidateGuestCartInput): Promise<Cart> {
        const response = await this.client.mutation(validateGuestCartMutation, { cartId: input.query['cartId'] });
        if (response.data?.validateGuestCart) {
            return Cart.fromJson(response.data.validateGuestCart);
        }
        throw new Error(`Failed to validate guest cart: ${JSON.stringify(response.errors || response)}`);
    }

    async convertGuestToEcommerceCart(input: ConvertGuestCartInput): Promise<Cart> {
        const response = await this.client.mutation(convertGuestToEcommerceCartMutation, { cartId: input.query['cartId'] });
        if (response.data?.convertGuestToEcommerceCart) {
            return Cart.fromJson(response.data.convertGuestToEcommerceCart);
        }
        throw new Error(`Failed to convert guest cart: ${JSON.stringify(response.errors || response)}`);
    }
}

export default GraphqlCartService;
