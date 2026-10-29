import assert from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';
import GraphqlProductService from '../src/core/services/product/GraphqlProductService';
import GetProductsBySKUFilter from '../src/core/services/product/GetProductsBySKUFilter';
import GetSuggestedProductsFilter from '../src/core/services/product/GetSuggestedProductsFilter';
import GetProductRecommendationsFilter from '../src/core/services/product/GetProductRecommendationsFilter';
import ProductRecommendationType from '../src/core/services/product/ProductRecommendationType';
import Product from '../src/core/models/catalog/Product';
import GraphqlClient from '../src/core/http/GraphqlClient';
import { test } from './harness';

const QUERIES_DIR = join(__dirname, '../src/core/services/product/queries');

type Call = { gql: string; variables: Record<string, unknown> };

function mockClient(response: Record<string, unknown>, calls: Call[] = []): { client: GraphqlClient; calls: Call[] } {
    const handler = async (gql: string, variables: Record<string, unknown>) => {
        calls.push({ gql, variables });
        return response;
    };
    const client = { query: handler, mutation: handler, fetch: handler } as unknown as GraphqlClient;
    return { client, calls };
}

async function query(file: string): Promise<string> {
    return (await import(join(QUERIES_DIR, file))).default as string;
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

// --- minimal SDL reader so selections can be checked against graphql_schema.graphql ---

type Schema = Map<string, Map<string, string>>;

function readSchema(): Schema {
    const types: Schema = new Map();
    let current: Map<string, string> | null = null;
    for (const line of readFileSync(join(__dirname, '../graphql_schema.graphql'), 'utf8').split('\n')) {
        const open = line.match(/^(?:type|interface) (\w+)/);
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

// the five product reads and the path from the root operation down to the CatalogProductModel selection
const PRODUCT_OPERATIONS: Array<[string, string]> = [
    ['SearchProductsQuery', 'products.'],
    ['GetProductsByCategoryQuery', 'category.products.'],
    ['GetProductsBySKUQuery', ''],
    ['GetSuggestedProductsQuery', ''],
    ['GetProductRecommendationsQuery', ''],
];

test('every product query selects seals and productVariants', async () => {
    for (const [file, prefix] of PRODUCT_OPERATIONS) {
        const selection = paths(await query(file), prefix);
        assert.ok(selection.has('seals'), `${file} does not select seals`);
        assert.ok(selection.has('productVariants'), `${file} does not select productVariants`);
    }
});

test('every product operation is valid against graphql_schema.graphql', async () => {
    for (const [file] of PRODUCT_OPERATIONS) {
        const errors = schemaErrors(await query(file));
        assert.deepStrictEqual(errors, [], `${file}: ${errors.join('; ')}`);
    }
});

test('seals and productVariants are fields of the CatalogProductModel the product queries return', () => {
    const catalog = schema.get('CatalogProductModel');
    assert.ok(catalog, 'CatalogProductModel is missing from the schema');
    assert.strictEqual(catalog.get('seals'), 'JSON');
    assert.strictEqual(catalog.get('productVariants'), 'JSON');
});

test('Product.fromJson maps seals and productVariants', () => {
    const seals = [{ type: 'ORGANIC', label: 'Organic' }];
    const productVariants = { colors: [{ name: 'red', skus: ['1'] }] };
    const product = Product.fromJson({ sku: '1', seals, productVariants });
    assert.deepStrictEqual(product.seals, seals);
    assert.deepStrictEqual(product.productVariants, productVariants);
});

test('Product defaults seals to an empty array and productVariants to null when absent', () => {
    const product = Product.fromJson({ sku: '1' });
    assert.deepStrictEqual(product.seals, []);
    assert.strictEqual(product.productVariants, null);
});

test('getProductsBySKU returns products carrying seals and productVariants', async () => {
    const seals = [{ type: 'ORGANIC' }];
    const productVariants = { colors: [{ name: 'red' }] };
    const { client, calls } = mockClient({
        data: { getProductsBySKU: [{ sku: '1', seals, productVariants }] },
    });
    const products = await new GraphqlProductService(client, 'c').getProductsBySKU(
        new GetProductsBySKUFilter({ skus: ['1'], storeReference: 'r' }),
    );
    assert.deepStrictEqual(products[0].seals, seals);
    assert.deepStrictEqual(products[0].productVariants, productVariants);
    assert.ok(calls[0].gql.includes('seals'));
    assert.ok(calls[0].gql.includes('productVariants'));
});

test('getSuggestedProducts and getProductRecommendations return products carrying seals and productVariants', async () => {
    const seals = [{ type: 'NEW' }];
    const productVariants = { sizes: [{ name: 'L' }] };
    const suggested = mockClient({ data: { getSuggestedProducts: [{ sku: '1', seals, productVariants }] } });
    const recommended = mockClient({ data: { getProductRecommendations: [{ sku: '2', seals, productVariants }] } });

    const [s, r] = await Promise.all([
        new GraphqlProductService(suggested.client, 'c').getSuggestedProducts(
            new GetSuggestedProductsFilter({ sku: '1', storeReference: 'r' }),
        ),
        new GraphqlProductService(recommended.client, 'c').getProductRecommendations(
            new GetProductRecommendationsFilter({ type: ProductRecommendationType.TRENDING, storeReference: 'r', data: {} }),
        ),
    ]);
    assert.deepStrictEqual(s[0].seals, seals);
    assert.deepStrictEqual(s[0].productVariants, productVariants);
    assert.deepStrictEqual(r[0].seals, seals);
    assert.deepStrictEqual(r[0].productVariants, productVariants);
    assert.ok(suggested.calls[0].gql.includes('seals'));
    assert.ok(recommended.calls[0].gql.includes('productVariants'));
});

test('schema check catches seals on a type that lacks it', () => {
    const broken = `
      query GetProductsBySKU($getProductsBySKUInput: GetProductsBySKUInput!) {
        getProductsBySKU(getProductsBySKUInput: $getProductsBySKUInput) { sku seals { type } }
      }
    `;
    assert.deepStrictEqual(schemaErrors(broken), ['seals.type: "type" is selected on the scalar JSON']);
});
