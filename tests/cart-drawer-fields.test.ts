import assert from 'assert';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import GraphqlCartService from '../src/core/services/cart/GraphqlCartService';
import RemoveSpecialProductInput from '../src/core/services/cart/RemoveSpecialProductInput';
import ValidateGuestCartInput from '../src/core/services/cart/ValidateGuestCartInput';
import Cart from '../src/core/models/cart/Cart';
import CartProduct from '../src/core/models/cart/CartProduct';
import PricesSummary from '../src/core/models/cart/PricesSummary';
import ProductsSummary from '../src/core/models/cart/ProductsSummary';
import SpecialProduct from '../src/core/models/cart/SpecialProduct';
import ValidatedCart from '../src/core/models/cart/ValidatedCart';
import GraphqlClient from '../src/core/http/GraphqlClient';
import * as sdk from '../src/index';
import { test } from './harness';

const CART_DIR = join(__dirname, '../src/core/services/cart');

type Call = { gql: string; variables: Record<string, unknown> };

function mockClient(response: Record<string, unknown>, calls: Call[] = []): GraphqlClient {
    const handler = async (gql: string, variables: Record<string, unknown>) => {
        calls.push({ gql, variables });
        return response;
    };
    return { query: handler, mutation: handler, fetch: handler } as unknown as GraphqlClient;
}

async function operation(kind: 'queries' | 'mutations', file: string): Promise<string> {
    return (await import(join(CART_DIR, kind, file))).default as string;
}

// --- structural reading of a selection (whitespace-insensitive) ---

type Parsed = { kind: 'query' | 'mutation'; root: string; paths: Set<string> };

function parseOperation(gql: string): Parsed {
    const header = gql.match(/^\s*(query|mutation)\s+\w+\s*(?:\([^)]*\))?\s*\{\s*(\w+)\s*(?:\([^)]*\))?\s*\{/);
    assert.ok(header, `unrecognised operation: ${gql.slice(0, 80)}`);
    const body = gql.slice(header[0].length).replace(/\}\s*\}\s*$/, '');
    const paths = new Set<string>();
    const stack: string[] = [];
    let last = '';
    let depth = 0;
    for (const token of body.match(/[A-Za-z_]\w*|[{}()]/g) || []) {
        if (token === '(') depth++;
        else if (token === ')') depth--;
        else if (depth > 0) continue;
        else if (token === '{') { stack.push(last); }
        else if (token === '}') { stack.pop(); }
        else { last = token; paths.add([...stack, token].join('.')); }
    }
    return { kind: header[1] as Parsed['kind'], root: header[2], paths };
}

function paths(gql: string, prefix = ''): Set<string> {
    const all = parseOperation(gql).paths;
    return prefix ? new Set([...all].filter((p) => p.startsWith(prefix)).map((p) => p.slice(prefix.length))) : all;
}

function assertHas(selection: Set<string>, expected: string[], label: string): void {
    const missing = expected.filter((p) => !selection.has(p));
    assert.deepStrictEqual(missing, [], `${label} is missing ${missing.join(', ')}`);
}

function assertLacks(selection: Set<string>, forbidden: string[], label: string): void {
    const present = forbidden.filter((p) => selection.has(p));
    assert.deepStrictEqual(present, [], `${label} must not select ${present.join(', ')}`);
}

// --- minimal SDL reader so selections can be checked against graphql_schema.graphql ---

type Schema = Map<string, Map<string, string>>;

function readSchema(): Schema {
    const types: Schema = new Map();
    let current: Map<string, string> | null = null;
    for (const line of readFileSync(join(__dirname, '../graphql_schema.graphql'), 'utf8').split('\n')) {
        const open = line.match(/^type (\w+)/);
        if (open) { current = new Map(); types.set(open[1], current); continue; }
        if (line.startsWith('}')) { current = null; continue; }
        const field = current && line.match(/^\s*(\w+)(?:\(.*\))?\s*:\s*([[\]\w!]+)/);
        if (current && field) current.set(field[1], field[2].replace(/[[\]!]/g, ''));
    }
    return types;
}

const schema = readSchema();

function schemaErrors(gql: string): string[] {
    const { kind, root, paths: selected } = parseOperation(gql);
    const rootType = schema.get(kind === 'query' ? 'Query' : 'Mutation');
    const rootReturn = rootType?.get(root);
    if (!rootReturn) return [`${root} is not a ${kind} in the schema`];
    const errors: string[] = [];
    const all = [...selected];
    for (const path of all) {
        let type: string | undefined = rootReturn;
        for (const segment of path.split('.')) {
            const fields: Map<string, string> | undefined = schema.get(type as string);
            if (!fields) { errors.push(`${path}: "${segment}" is selected on the scalar ${type}`); type = undefined; break; }
            type = fields.get(segment);
            if (!type) { errors.push(`${path}: no field "${segment}"`); break; }
        }
        const isLeaf = !all.some((other) => other.startsWith(`${path}.`));
        if (type && isLeaf && schema.has(type)) errors.push(`${path}: object type ${type} needs a selection`);
    }
    return errors;
}

const PRODUCTS_SUMMARY_FIELDS = [
    'productsTotal', 'fullProductsPrice', 'totalProductsDiscount', 'missingForMinimumOrderValue', 'missingForFreeShipping',
    'isApplicableForFreeShipping', 'productsTotalBeforeTaxes', 'fullProductsPriceBeforeTaxes', 'totalProductsDiscountBeforeTaxes',
    'missingForMinimumOrderValueBeforeTaxes', 'missingForFreeShippingBeforeTaxes',
];
const SUMMARY = PRODUCTS_SUMMARY_FIELDS.map((f) => `pricesSummary.productsSummary.${f}`);
const METADATA = ['minUnitQuantity', 'maxUnitQuantity', 'clickMultiplier', 'suggestedUnit'].map((f) => `validationIssues.metadata.${f}`);

// every operation that returns the shared cart selection, by file
const SHARED: Array<['queries' | 'mutations', string, string]> = [
    ['queries', 'GetEcommerceCartQuery', ''],
    ['queries', 'GetActiveEcommerceCartQuery', ''],
    ['queries', 'GetGuestCartQuery', ''],
    ['mutations', 'CreateCartMutation', ''],
    ['mutations', 'CreateGuestCartMutation', ''],
    ['mutations', 'GetOrCreateCartMutation', ''],
    ['mutations', 'UpdateCartMutation', ''],
    ['mutations', 'UpdateGuestCartMutation', ''],
    ['mutations', 'DeleteCartMutation', ''],
    ['mutations', 'DeleteGuestCartMutation', ''],
    ['mutations', 'AddProductMutation', ''],
    ['mutations', 'AddProductsMutation', 'cart.'],
    ['mutations', 'AddProductToGuestCartMutation', ''],
    ['mutations', 'UpdateProductMutation', ''],
    ['mutations', 'UpdateProductInGuestCartMutation', ''],
    ['mutations', 'RemoveProductMutation', ''],
    ['mutations', 'DeleteProductInGuestCartMutation', ''],
    ['mutations', 'DeleteSpecialProductMutation', ''],
    ['mutations', 'ConvertGuestToEcommerceCartMutation', ''],
];

test('shared cart selection carries line type/createdAt, special-product createdAt and productsSummary', async () => {
    for (const [kind, file, prefix] of SHARED) {
        const selection = paths(await operation(kind, file), prefix);
        assertHas(selection, ['products.type', 'products.createdAt', 'specialProducts.createdAt', 'deliverySlot.id', ...SUMMARY], file);
    }
});

test('shared cart selection leaves validation-only fields out', async () => {
    for (const [kind, file, prefix] of SHARED) {
        const selection = paths(await operation(kind, file), prefix);
        assertLacks(selection, ['products.isSample', 'products.clickMultiplier', 'validationIssues.metadata', 'address.address'], file);
        assertHas(selection, ['validationIssues.reason', 'validationIssues.type', 'validationIssues.productId'], file);
    }
});

test('authenticated validation selects the validated fields and no deliverySlot', async () => {
    const validate = await operation('mutations', 'ValidateCartMutation');
    const coupon = await operation('mutations', 'UpdateCouponMutation');
    for (const [label, gql] of [['validateEcommerceCart', validate], ['updateCouponInEcommerceCart', coupon]]) {
        const selection = paths(gql);
        assertHas(selection, [
            'products.type', 'products.createdAt', 'products.isSample', 'products.clickMultiplier',
            'specialProducts.createdAt', 'address.address.other', ...SUMMARY, ...METADATA,
            'validationIssues.reason', 'validationIssues.type', 'validationIssues.productId',
        ], label);
        assertLacks(selection, ['deliverySlot', 'deliverySlot.id'], label);
    }
    assertHas(paths(validate), ['groups.id', 'loyalty.availablePoints.points'], 'validateEcommerceCart');
});

test('guest validation selects the validated fields and none of address, customer, special products', async () => {
    const selection = paths(await operation('mutations', 'ValidateGuestCartMutation'));
    assertHas(selection, [
        'products.type', 'products.createdAt', 'products.isSample', 'products.clickMultiplier',
        ...SUMMARY, ...METADATA, 'validationIssues.reason', 'validationIssues.type', 'validationIssues.productId',
    ], 'validateGuestCart');
    assertLacks(selection, ['deliverySlot', 'address', 'customer', 'specialProducts'], 'validateGuestCart');
});

test('every cart operation is valid against graphql_schema.graphql', async () => {
    const checked: string[] = [];
    for (const kind of ['queries', 'mutations'] as const) {
        for (const file of readdirSync(join(CART_DIR, kind)).filter((f) => f.endsWith('.ts'))) {
            const errors = schemaErrors(await operation(kind, file.replace(/\.ts$/, '')));
            assert.deepStrictEqual(errors, [], `${file}: ${errors.join('; ')}`);
            checked.push(file);
        }
    }
    assert.ok(checked.length >= 23, `expected the cart operations to be discovered, got ${checked.length}`);
});

test('schema check catches a field the backend type lacks (the 3.4.0 deliverySlot bug)', () => {
    const broken = `
      mutation ValidateEcommerceCart($cartId: ID!) {
        validateEcommerceCart(cartId: $cartId) { id deliverySlot { id } }
      }
    `;
    assert.deepStrictEqual(schemaErrors(broken), ['deliverySlot: no field "deliverySlot"', 'deliverySlot.id: no field "deliverySlot"']);
});

const productsSummaryJson = {
    productsTotal: 90, fullProductsPrice: 100, totalProductsDiscount: 10, missingForMinimumOrderValue: 5, missingForFreeShipping: 20,
    isApplicableForFreeShipping: true, productsTotalBeforeTaxes: 80, fullProductsPriceBeforeTaxes: 90, totalProductsDiscountBeforeTaxes: 10,
    missingForMinimumOrderValueBeforeTaxes: 4, missingForFreeShippingBeforeTaxes: 18,
};

test('ProductsSummary parses the 11 fields', () => {
    assert.deepStrictEqual({ ...ProductsSummary.fromJson(productsSummaryJson) }, productsSummaryJson);
});

test('PricesSummary.productsSummary is parsed when present and null when absent, never zeros', () => {
    const present = PricesSummary.fromJson({ total: 90, productsSummary: productsSummaryJson });
    assert.ok(present.productsSummary instanceof ProductsSummary);
    assert.strictEqual(present.productsSummary.missingForFreeShipping, 20);
    for (const json of [{ total: 90 }, { total: 90, productsSummary: null }]) {
        assert.strictEqual(PricesSummary.fromJson(json).productsSummary, null);
    }
    assert.strictEqual(new PricesSummary({}).productsSummary, null);
    assert.strictEqual(Cart.fromJson({ id: 'c1' }).pricesSummary.productsSummary, null);
});

test('CartProduct parses type, createdAt, isSample and clickMultiplier and keeps them null when absent', () => {
    const line = CartProduct.fromJson({ id: 'p1', type: 'BAG', createdAt: '2026-10-01T10:00:00.000Z', isSample: true, clickMultiplier: 0.5 });
    assert.deepStrictEqual(
        [line.type, line.createdAt, line.isSample, line.clickMultiplier],
        ['BAG', '2026-10-01T10:00:00.000Z', true, 0.5],
    );
    const plain = CartProduct.fromJson({ id: 'p2' });
    assert.deepStrictEqual([plain.type, plain.createdAt, plain.isSample, plain.clickMultiplier], [null, null, null, null]);
    const explicitNull = CartProduct.fromJson({ id: 'p3', type: null, createdAt: null, isSample: null, clickMultiplier: null });
    assert.deepStrictEqual([explicitNull.type, explicitNull.createdAt, explicitNull.isSample, explicitNull.clickMultiplier], [null, null, null, null]);
});

test('CartProduct keeps isSample false and clickMultiplier 0 instead of turning them into null', () => {
    const line = CartProduct.fromJson({ id: 'p1', isSample: false, clickMultiplier: 0 });
    assert.strictEqual(line.isSample, false);
    assert.strictEqual(line.clickMultiplier, 0);
});

test('SpecialProduct parses createdAt and keeps it null when absent', () => {
    assert.strictEqual(SpecialProduct.fromJson({ id: 's1', createdAt: '2026-10-01T10:00:00.000Z' }).createdAt, '2026-10-01T10:00:00.000Z');
    assert.strictEqual(SpecialProduct.fromJson({ id: 's1' }).createdAt, null);
});

test('Cart and ValidatedCart carry the new fields through fromJson', () => {
    const json = {
        id: 'c1',
        products: [{ id: 'p1', type: 'DEFAULT', createdAt: '2026-10-01T10:00:00.000Z', isSample: false, clickMultiplier: 2 }],
        specialProducts: [{ id: 's1', createdAt: '2026-10-02T10:00:00.000Z' }],
        pricesSummary: { total: 90, productsSummary: productsSummaryJson },
        validationIssues: [{ reason: 'PRODUCT_MIN_QUANTITY_NOT_MET', type: 'ERROR', productId: 'p1', metadata: { minUnitQuantity: 2, suggestedUnit: 'kg' } }],
    };
    for (const cart of [Cart.fromJson(json), ValidatedCart.fromJson(json)]) {
        assert.strictEqual(cart.products[0].clickMultiplier, 2);
        assert.strictEqual(cart.specialProducts[0].createdAt, '2026-10-02T10:00:00.000Z');
        assert.strictEqual(cart.pricesSummary.productsSummary?.productsTotal, 90);
        assert.deepStrictEqual(cart.validationIssues[0].metadata, { minUnitQuantity: 2, suggestedUnit: 'kg' });
    }
});

test('removeSpecialProduct sends deleteSpecialProductInEcommerceCart with its input and returns a Cart', async () => {
    const calls: Call[] = [];
    const service = new GraphqlCartService(mockClient({ data: { deleteSpecialProductInEcommerceCart: { id: 'c1' } } }, calls));
    const cart = await service.removeSpecialProduct(new RemoveSpecialProductInput({ cartId: 'c1', specialProductId: 's1' }));
    assert.ok(cart instanceof Cart);
    assert.strictEqual(cart.id, 'c1');
    assert.strictEqual(calls.length, 1);
    assert.match(calls[0].gql, /mutation DeleteSpecialProductInEcommerceCart\(\$deleteSpecialProductInCartInput: DeleteSpecialProductInCartInput!\)/);
    assert.match(calls[0].gql, /deleteSpecialProductInEcommerceCart\(deleteSpecialProductInCartInput: \$deleteSpecialProductInCartInput\)/);
    assert.deepStrictEqual(calls[0].variables, { deleteSpecialProductInCartInput: { cartId: 'c1', specialProductId: 's1' } });
});

test('deleteGuestCart sends deleteGuestCart with the cart id and returns a Cart', async () => {
    const calls: Call[] = [];
    const service = new GraphqlCartService(mockClient({ data: { deleteGuestCart: { id: 'g1' } } }, calls));
    const cart = await service.deleteGuestCart('g1');
    assert.ok(cart instanceof Cart);
    assert.strictEqual(cart.id, 'g1');
    assert.match(calls[0].gql, /mutation DeleteGuestCart\(\$cartId: ID!\)/);
    assert.match(calls[0].gql, /deleteGuestCart\(cartId: \$cartId\)/);
    assert.deepStrictEqual(calls[0].variables, { cartId: 'g1' });
});

test('removeSpecialProduct and deleteGuestCart throw with the serialized errors when data lacks the operation', async () => {
    const errors = [{ message: 'UNAUTHORIZED' }];
    const service = new GraphqlCartService(mockClient({ errors }));
    await assert.rejects(
        service.removeSpecialProduct(new RemoveSpecialProductInput({ cartId: 'c1', specialProductId: 's1' })),
        (e: Error) => e.message.includes('Failed to remove special product from cart') && e.message.includes(JSON.stringify(errors)),
    );
    await assert.rejects(
        service.deleteGuestCart('g1'),
        (e: Error) => e.message.includes('Failed to delete guest cart') && e.message.includes(JSON.stringify(errors)),
    );
});

test('validateGuestCart returns a ValidatedCart with the validation-only line fields', async () => {
    const calls: Call[] = [];
    const response = { data: { validateGuestCart: { id: 'g1', products: [{ id: 'p1', isSample: true, clickMultiplier: 0.5 }] } } };
    const service = new GraphqlCartService(mockClient(response, calls));
    const cart = await service.validateGuestCart(new ValidateGuestCartInput({ cartId: 'g1' }));
    assert.ok(cart instanceof ValidatedCart);
    assert.deepStrictEqual(cart.groups, []);
    assert.strictEqual(cart.products[0].isSample, true);
    assert.strictEqual(cart.products[0].clickMultiplier, 0.5);
    assert.deepStrictEqual(calls[0].variables, { cartId: 'g1' });
});

test('the models and the new input are exported from the package root', () => {
    assert.strictEqual(sdk.RemoveSpecialProductInput, RemoveSpecialProductInput);
    assert.strictEqual(sdk.PricesSummary, PricesSummary);
    assert.strictEqual(sdk.ProductsSummary, ProductsSummary);
    assert.strictEqual(sdk.SpecialProduct, SpecialProduct);
    assert.deepStrictEqual({ ...new RemoveSpecialProductInput({ cartId: 'c1', specialProductId: 's1' }).query }, { cartId: 'c1', specialProductId: 's1' });
});
