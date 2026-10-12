import assert from 'assert';
import GraphqlAddressService from '../src/core/services/address/GraphqlAddressService';
import GetAddressesFilter from '../src/core/services/address/GetAddressesFilter';
import GraphqlClient from '../src/core/http/GraphqlClient';
import { test } from './harness';

type Call = { gql: string; variables: Record<string, unknown> };

function mockClient(response: Record<string, unknown>, calls: Call[] = []): GraphqlClient {
    const handler = async (gql: string, variables: Record<string, unknown>) => {
        calls.push({ gql, variables });
        return response;
    };
    return { query: handler, mutation: handler, fetch: handler } as unknown as GraphqlClient;
}

const addressJson = {
    id: 'a1',
    description: 'Home',
    address: { other: 'Street 1', structure: { a: 1 } },
    addressTwo: '',
    available: true,
    latitude: 4.6,
    longitude: -74.1,
    city: 'Bogota',
    state: null,
    zipCode: '110111',
    removed: false,
    customerId: 'c1',
    distanceToStore: 1.5,
};

test('getAddresses maps a populated response including new fields', async () => {
    const calls: Call[] = [];
    const service = new GraphqlAddressService(mockClient({ data: { getAddresses: [addressJson] } }, calls));
    const result = await service.getAddresses(new GetAddressesFilter({ storeReference: 'S1' }));
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0].address, { other: 'Street 1', structure: { a: 1 } });
    assert.strictEqual(result[0].removed, false);
    assert.strictEqual(result[0].distanceToStore, 1.5);
    assert.deepStrictEqual(calls[0].variables, { getAddressesInput: { storeReference: 'S1' } });
});

test('getAddresses defaults missing nullable fields to null', async () => {
    const service = new GraphqlAddressService(
        mockClient({ data: { getAddresses: [{ id: 'a2', description: 'x', latitude: 1, longitude: 2, address: { other: 'o' } }] } }),
    );
    const [a] = await service.getAddresses(new GetAddressesFilter({ storeReference: 'S1' }));
    assert.strictEqual(a.removed, null);
    assert.strictEqual(a.distanceToStore, null);
    assert.strictEqual(a.address?.structure, null);
});

test('getAddresses returns an empty list', async () => {
    const service = new GraphqlAddressService(mockClient({ data: { getAddresses: [] } }));
    assert.deepStrictEqual(await service.getAddresses(new GetAddressesFilter({ storeReference: 'S1' })), []);
});

test('getAddresses throws on backend error', async () => {
    const service = new GraphqlAddressService(mockClient({ errors: [{ message: 'Unauthorized' }] }));
    await assert.rejects(() => service.getAddresses(new GetAddressesFilter({ storeReference: 'S1' })), /getAddresses failed: .*Unauthorized/);
});

test('getAddresses rejects invalid paging without calling the client', async () => {
    const calls: Call[] = [];
    const service = new GraphqlAddressService(mockClient({ data: { getAddresses: [] } }, calls));
    for (const bad of [{ pageSize: 0 }, { currentPage: 0 }, { pageSize: 1.5 }, { currentPage: -1 }]) {
        await assert.rejects(() => service.getAddresses(new GetAddressesFilter({ storeReference: 'S1', ...bad })), /must be an integer >= 1/);
    }
    assert.strictEqual(calls.length, 0);
    await service.getAddresses(new GetAddressesFilter({ storeReference: 'S1', pageSize: 1, currentPage: 1 }));
    assert.strictEqual(calls.length, 1);
});
