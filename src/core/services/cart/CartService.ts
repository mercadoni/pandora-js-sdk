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
import CreateGuestCartFilter from './CreateGuestCartFilter';
import GetGuestCartFilter from './GetGuestCartFilter';
import UpdateGuestCartFilter from './UpdateGuestCartFilter';
import AddProductToGuestCartFilter from './AddProductToGuestCartFilter';
import UpdateProductInGuestCartFilter from './UpdateProductInGuestCartFilter';
import DeleteProductInGuestCartFilter from './DeleteProductInGuestCartFilter';
import ValidateGuestCartFilter from './ValidateGuestCartFilter';
import ConvertGuestCartFilter from './ConvertGuestCartFilter';
import Cart from '../../models/cart/Cart';
import ValidatedCart from '../../models/cart/ValidatedCart';
import Purchase from '../../models/cart/Purchase';

interface CartService {
    getCart(cartId: string): Promise<Cart>;
    getActiveCart(filter: GetActiveCartFilter): Promise<Cart>;
    createCart(filter: CreateCartFilter): Promise<Cart>;
    createGuestCart(filter: CreateGuestCartFilter): Promise<Cart>;
    getGuestCart(filter: GetGuestCartFilter): Promise<Cart>;
    getOrCreateCart(filter: CreateCartFilter): Promise<Cart>;
    updateCart(filter: UpdateCartFilter): Promise<Cart>;
    updateGuestCart(filter: UpdateGuestCartFilter): Promise<Cart>;
    deleteCart(cartId: string): Promise<Cart>;
    addProduct(filter: AddProductFilter): Promise<Cart>;
    addProducts(filter: AddProductsFilter): Promise<{ cart: Cart; confirmationStatuses: Array<Record<string, any>> }>;
    addProductToGuestCart(filter: AddProductToGuestCartFilter): Promise<Cart>;
    updateProduct(filter: UpdateProductFilter): Promise<Cart>;
    updateProductInGuestCart(filter: UpdateProductInGuestCartFilter): Promise<Cart>;
    removeProduct(filter: RemoveProductFilter): Promise<Cart>;
    deleteProductInGuestCart(filter: DeleteProductInGuestCartFilter): Promise<Cart>;
    validateCart(filter: ValidateCartFilter): Promise<ValidatedCart>;
    validateGuestCart(filter: ValidateGuestCartFilter): Promise<Cart>;
    purchaseCart(filter: PurchaseCartFilter): Promise<Purchase>;
    applyCoupon(filter: CouponFilter): Promise<ValidatedCart>;
    convertGuestToEcommerceCart(filter: ConvertGuestCartFilter): Promise<Cart>;
}

export default CartService;
