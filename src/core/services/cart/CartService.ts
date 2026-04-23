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

interface CartService {
    getCart(cartId: string): Promise<Cart>;
    getActiveCart(filter: GetActiveCartFilter): Promise<Cart>;
    createCart(input: CreateCartInput): Promise<Cart>;
    createGuestCart(input: CreateGuestCartInput): Promise<Cart>;
    getGuestCart(filter: GetGuestCartFilter): Promise<Cart>;
    getOrCreateCart(input: CreateCartInput): Promise<Cart>;
    updateCart(input: UpdateCartInput): Promise<Cart>;
    updateGuestCart(input: UpdateGuestCartInput): Promise<Cart>;
    deleteCart(cartId: string): Promise<Cart>;
    addProduct(input: AddProductInput): Promise<Cart>;
    addProducts(input: AddProductsInput): Promise<{ cart: Cart; confirmationStatuses: Array<Record<string, any>> }>;
    addProductToGuestCart(input: AddProductToGuestCartInput): Promise<Cart>;
    updateProduct(input: UpdateProductInput): Promise<Cart>;
    updateProductInGuestCart(input: UpdateProductInGuestCartInput): Promise<Cart>;
    removeProduct(input: RemoveProductInput): Promise<Cart>;
    deleteProductInGuestCart(input: DeleteProductInGuestCartInput): Promise<Cart>;
    validateCart(input: ValidateCartInput): Promise<ValidatedCart>;
    validateGuestCart(input: ValidateGuestCartInput): Promise<Cart>;
    purchaseCart(input: PurchaseCartInput): Promise<Purchase>;
    applyCoupon(input: CouponInput): Promise<ValidatedCart>;
    convertGuestToEcommerceCart(input: ConvertGuestCartInput): Promise<Cart>;
}

export default CartService;
