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

interface CartService {
    getCart(cartId: string): Promise<Cart>;
    getActiveCart(filter: GetActiveCartFilter): Promise<Cart>;
    createCart(filter: CreateCartFilter): Promise<Cart>;
    getOrCreateCart(filter: CreateCartFilter): Promise<Cart>;
    updateCart(filter: UpdateCartFilter): Promise<Cart>;
    deleteCart(cartId: string): Promise<Cart>;
    addProduct(filter: AddProductFilter): Promise<Cart>;
    addProducts(filter: AddProductsFilter): Promise<{ cart: Cart; confirmationStatuses: Array<Record<string, any>> }>;
    updateProduct(filter: UpdateProductFilter): Promise<Cart>;
    removeProduct(filter: RemoveProductFilter): Promise<Cart>;
    validateCart(filter: ValidateCartFilter): Promise<ValidatedCart>;
    purchaseCart(filter: PurchaseCartFilter): Promise<Purchase>;
    applyCoupon(filter: CouponFilter): Promise<ValidatedCart>;
}

export default CartService;
