import assert from 'assert';
import GraphqlFulfillmentService from '../src/core/services/fulfillment/GraphqlFulfillmentService';
import GetStoresNearbyByAddressFilter from '../src/core/services/fulfillment/GetStoresNearbyByAddressFilter';
import GetStoresNearbyFilter from '../src/core/services/fulfillment/GetStoresNearbyFilter';
import StoreModel from '../src/core/models/fulfillment/StoreModel';
import GraphqlClient from '../src/core/http/GraphqlClient';
import { test } from './harness';

type Call = { gql: string; variables: Record<string, unknown> };

function mockClient(response: Record<string, unknown>) {
    const calls: Call[] = [];
    const client = {
        query: async (gql: string, variables: Record<string, unknown>) => {
            calls.push({ gql, variables });
            return response;
        },
        mutation: async () => ({}),
        fetch: async () => ({}),
    } as unknown as GraphqlClient;
    return { client, calls };
}

const storeJson = { id: '1', code: 'c', name: 'n', address: 'a', cities: [{ name: 'x' }] };

test('byAddress returns StoreModel[] and sends variables', async () => {
    const { client, calls } = mockClient({ data: { getStoresNearbyByAddress: [storeJson] } });
    const stores = await new GraphqlFulfillmentService(client).getStoresNearbyByAddress(
        new GetStoresNearbyByAddressFilter({ clientId: 'c', addressId: 'a1', operationalModel: 'DELIVERY', storeReferences: ['r'] }),
    );
    assert.ok(stores[0] instanceof StoreModel);
    assert.strictEqual(stores[0].dynamicParams, null);
    assert.strictEqual(stores[0].sphereDistance, null);
    assert.deepStrictEqual(calls[0].variables, { clientId: 'c', addressId: 'a1', operationalModel: 'DELIVERY', storeReferences: ['r'] });
    assert.ok(calls[0].gql.includes('getStoresNearbyByAddress'));
});

test('byAddress omits undefined optional fields', async () => {
    const f = new GetStoresNearbyByAddressFilter({ clientId: 'c', addressId: 'a1' });
    assert.deepStrictEqual(f.query, { clientId: 'c', addressId: 'a1' });
});

test('byAddress returns empty array when no store serves the address', async () => {
    const { client } = mockClient({ data: { getStoresNearbyByAddress: [] } });
    const stores = await new GraphqlFulfillmentService(client).getStoresNearbyByAddress(
        new GetStoresNearbyByAddressFilter({ clientId: 'c', addressId: 'a1' }),
    );
    assert.deepStrictEqual(stores, []);
});

test('byAddress throws with serialized errors when data is missing', async () => {
    const { client } = mockClient({ errors: [{ message: 'unauthorized' }] });
    await assert.rejects(
        new GraphqlFulfillmentService(client).getStoresNearbyByAddress(
            new GetStoresNearbyByAddressFilter({ clientId: 'c', addressId: 'a1' }),
        ),
        /getStoresNearbyByAddress failed: .*unauthorized/,
    );
});

test('getStoresNearby still accepts a plain string operationalModel', async () => {
    const model: string = 'DELIVERY';
    const f = new GetStoresNearbyFilter({ clientId: 'c', operationalModel: model, coordinates: { latitude: 1, longitude: 2 } });
    assert.strictEqual(f.query['operationalModel'], 'DELIVERY');
});

test('StoreModel.fromJson keeps dynamicParams when present', async () => {
    assert.deepStrictEqual(StoreModel.fromJson({ ...storeJson, dynamicParams: { a: 1 } }).dynamicParams, { a: 1 });
});

test('StoreModel.fromJson maps sphereDistance and dynamicParams', async () => {
    const s = StoreModel.fromJson({ ...storeJson, sphereDistance: 1.5, dynamicParams: { k: 'v' } });
    assert.strictEqual(s.sphereDistance, 1.5);
    assert.deepStrictEqual(s.dynamicParams, { k: 'v' });
    assert.strictEqual(StoreModel.fromJson({ ...storeJson, sphereDistance: 0 }).sphereDistance, 0);
});

test('both nearby queries select sphereDistance and dynamicParams and accept filter', async () => {
    const a = mockClient({ data: { getStoresNearbyByAddress: [] } });
    const c = mockClient({ data: { getStoresNearbyByCoords: [] } });
    const filter = { city: 'x', kind: 'k' };
    await new GraphqlFulfillmentService(a.client).getStoresNearbyByAddress(
        new GetStoresNearbyByAddressFilter({ clientId: 'c', addressId: 'a1', filter }),
    );
    await new GraphqlFulfillmentService(c.client).getStoresNearby(
        new GetStoresNearbyFilter({ clientId: 'c', operationalModel: 'PICK_AND_COLLECT', coordinates: { latitude: 1, longitude: 2 }, filter }),
    );
    for (const call of [a.calls[0], c.calls[0]]) {
        assert.ok(call.gql.includes('sphereDistance dynamicParams'));
        assert.ok(call.gql.includes('filter: $filter'));
        assert.deepStrictEqual(call.variables['filter'], filter);
    }
});

test('filter is omitted from variables when undefined', async () => {
    const f = new GetStoresNearbyFilter({ clientId: 'c', operationalModel: 'DELIVERY', coordinates: { latitude: 1, longitude: 2 } });
    assert.ok(!('filter' in f.query));
});

test('byAddress sends no token handling: authentication is the caller\'s responsibility', async () => {
    // The service only forwards variables; a missing customer token surfaces as a backend error.
    const { client } = mockClient({ errors: [{ message: 'unauthenticated' }] });
    await assert.rejects(
        new GraphqlFulfillmentService(client).getStoresNearbyByAddress(
            new GetStoresNearbyByAddressFilter({ clientId: 'c', addressId: 'a1' }),
        ),
        /unauthenticated/,
    );
});
