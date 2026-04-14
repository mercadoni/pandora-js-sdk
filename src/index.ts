import Platform from "./core/Platform";
import HomeFilter from "./core/services/home/HomeFilter";
import SignInFilter from "./core/services/auth/SignInFilter";
import SignUpFilter from "./core/services/auth/SignUpFilter";
import RefreshTokensFilter from "./core/services/auth/RefreshTokensFilter";
import ForgotPasswordFilter from "./core/services/auth/ForgotPasswordFilter";
import CreateCartFilter from "./core/services/cart/CreateCartFilter";
import AddProductFilter from "./core/services/cart/AddProductFilter";
import AddProductsFilter from "./core/services/cart/AddProductsFilter";
import UpdateProductFilter from "./core/services/cart/UpdateProductFilter";
import RemoveProductFilter from "./core/services/cart/RemoveProductFilter";
import UpdateCartFilter from "./core/services/cart/UpdateCartFilter";
import ValidateCartFilter from "./core/services/cart/ValidateCartFilter";
import PurchaseCartFilter from "./core/services/cart/PurchaseCartFilter";
import CouponFilter from "./core/services/cart/CouponFilter";
import GetActiveCartFilter from "./core/services/cart/GetActiveCartFilter";

const platform = new Platform({
    baseUrl: 'YOUR_API_URL',
    clientId: 'YOUR_CLIENT_ID'
});

// Example: GetDynamicHome
(async function fetchHome() {

    const homeFilter = new HomeFilter({
        byStore: 'YOUR_STORE_ID',
        byPlatform: 'WEB',
        byScreenSize: 'large'
    });

    const home = await platform.homeService.home({ filter: homeFilter });
    console.log("home", home);

})();

// Example: SignIn
(async function signIn() {

    const auth = await platform.authService.signIn(new SignInFilter({
        clientId: 'YOUR_CLIENT_ID',
        email: 'user@example.com',
        password: 'password123'
    }));

    platform.setToken(auth.token!);

})();

// Example: SignUp
(async function signUp() {

    const auth = await platform.authService.signUp(new SignUpFilter({
        clientId: 'YOUR_CLIENT_ID',
        customerData: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+1234567890'
        }
    }));

    platform.setToken(auth.token);

})();

// Example: RefreshTokens
(async function refreshSession() {

    const refreshed = await platform.authService.refreshTokens(new RefreshTokensFilter({
        refreshToken: 'STORED_REFRESH_TOKEN'
    }));

    platform.setToken(refreshed.token);

})();

// Example: ForgotPassword
(async function forgotPassword() {

    await platform.authService.forgotPassword(new ForgotPasswordFilter({
        clientId: 'YOUR_CLIENT_ID',
        email: 'user@example.com'
    }));

})();

// Example: Logout
(async function logout() {

    await platform.authService.logout();

})();

// Example: GetOrCreateCart
(async function getOrCreateCart() {

    const cart = await platform.cartService.getOrCreateCart(new CreateCartFilter({
        storeReference: '11808',
        operationalModel: 'DELIVERY'
    }));

    console.log(cart.id);

})();

// Example: GetActiveCart
(async function getActiveCart() {

    const cart = await platform.cartService.getActiveCart(new GetActiveCartFilter({
        storeReference: '11808',
        operationalModel: 'DELIVERY'
    }));

    console.log(cart.id);

})();

// Example: GetCart by ID
(async function getCart() {

    const cart = await platform.cartService.getCart('CART_ID');

    console.log(cart.products);

})();

// Example: AddProduct to cart
(async function addProduct() {

    const cart = await platform.cartService.addProduct(new AddProductFilter({
        cartId: 'CART_ID',
        reference: 'SKU123',
        unit: 'UN',
        unitQuantity: 2
    }));

    console.log(cart.pricesSummary.total);

})();

// Example: AddProducts (bulk) to cart
(async function addProducts() {

    const { cart, confirmationStatuses } = await platform.cartService.addProducts(new AddProductsFilter({
        cartId: 'CART_ID',
        products: [
            { reference: 'SKU123', unit: 'UN', unitQuantity: 1 },
            { reference: 'SKU456', unit: 'UN', unitQuantity: 3 }
        ]
    }));

    console.log(cart.products.length, confirmationStatuses);

})();

// Example: UpdateProduct in cart
(async function updateProduct() {

    const cart = await platform.cartService.updateProduct(new UpdateProductFilter({
        cartId: 'CART_ID',
        productId: 'PRODUCT_ID',
        unitQuantity: 5
    }));

    console.log(cart.pricesSummary.total);

})();

// Example: RemoveProduct from cart
(async function removeProduct() {

    const cart = await platform.cartService.removeProduct(new RemoveProductFilter({
        cartId: 'CART_ID',
        productId: 'PRODUCT_ID'
    }));

    console.log(cart.products.length);

})();

// Example: UpdateCart (set address, slot, payment method)
(async function updateCart() {

    const cart = await platform.cartService.updateCart(new UpdateCartFilter({
        cartId: 'CART_ID',
        addressId: 'ADDRESS_ID',
        paymentMethod: { type: 'PAY_ON_DELIVERY', name: 'Cash' }
    }));

    console.log(cart.address);

})();

// Example: ApplyCoupon
(async function applyCoupon() {

    const validatedCart = await platform.cartService.applyCoupon(new CouponFilter({
        cartId: 'CART_ID',
        couponCode: 'DISCOUNT10'
    }));

    console.log(validatedCart.coupon);

})();

// Example: ValidateCart
(async function validateCart() {

    const validatedCart = await platform.cartService.validateCart(new ValidateCartFilter({
        cartId: 'CART_ID'
    }));

    console.log(validatedCart.validationIssues);

})();

// Example: PurchaseCart
(async function purchaseCart() {

    const purchase = await platform.cartService.purchaseCart(new PurchaseCartFilter({
        cartId: 'CART_ID',
        paymentInput: {
            paymentMethod: { type: 'PAY_ON_DELIVERY', name: 'Cash' }
        }
    }));

    console.log(purchase.jobNumber);

})();
