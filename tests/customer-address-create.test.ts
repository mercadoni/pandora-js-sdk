import assert from 'assert';
import GraphqlAddressService from '../src/core/services/address/GraphqlAddressService';
import CreateAddressInput from '../src/core/services/address/CreateAddressInput';
import GraphqlClient from '../src/core/http/GraphqlClient';
import { test } from './harness';

type Call = { gql: string; variables: Record<string, unknown> };
type SentInput = { id?: string; addressTwo?: string; state?: string; zipCode?: string; customerId?: string; address: { other: string; structure?: unknown } };

function mockClient(response: Record<string, unknown>, calls: Call[] = []): GraphqlClient {
    const handler = async (gql: string, variables: Record<string, unknown>) => {
        calls.push({ gql, variables });
        return response;
    };
    return { query: handler, mutation: handler, fetch: handler } as unknown as GraphqlClient;
}

function sentInput(calls: Call[]): SentInput {
    return calls[0].variables.upsertAddressInput as SentInput;
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

const validCreate = {
    description: 'Home',
    address: { other: 'Street 1' },
    latitude: 4.6,
    longitude: -74.1,
    city: 'Bogota',
    storeReference: 'S1',
};

test('createAddress sends upsert payload without id and defaults addressTwo', async () => {
    const calls: Call[] = [];
    const service = new GraphqlAddressService(mockClient({ data: { upsertAddress: addressJson } }, calls));
    const result = await service.createAddress(new CreateAddressInput(validCreate));
    assert.strictEqual(result.id, 'a1');
    const sent = sentInput(calls);
    assert.strictEqual('id' in sent, false);
    assert.strictEqual(sent.addressTwo, '');
    assert.deepStrictEqual(sent.address, { other: 'Street 1' });
    for (const k of ['state', 'zipCode', 'customerId']) assert.strictEqual(k in sent, false);
    assert.match(calls[0].gql, /mutation UpsertAddress/);
});

test('createAddress forwards optional fields when defined', async () => {
    const calls: Call[] = [];
    const service = new GraphqlAddressService(mockClient({ data: { upsertAddress: addressJson } }, calls));
    await service.createAddress(
        new CreateAddressInput({ ...validCreate, addressTwo: 'Apt 4', state: 'DC', zipCode: '110111', customerId: 'c1', address: { other: 'S', structure: { n: 1 } } }),
    );
    const sent = sentInput(calls);
    assert.deepStrictEqual(
        { a2: sent.addressTwo, s: sent.state, z: sent.zipCode, c: sent.customerId, st: sent.address.structure },
        { a2: 'Apt 4', s: 'DC', z: '110111', c: 'c1', st: { n: 1 } },
    );
});

test('createAddress rejects invalid input without calling the client', async () => {
    const calls: Call[] = [];
    const service = new GraphqlAddressService(mockClient({ data: { upsertAddress: addressJson } }, calls));
    const bad = [
        { description: ' ' },
        { address: { other: '' } },
        { city: '' },
        { storeReference: '' },
        { latitude: 91 },
        { latitude: -90.1 },
        { longitude: 180.5 },
        { longitude: NaN },
    ];
    for (const b of bad) {
        await assert.rejects(() => service.createAddress(new CreateAddressInput({ ...validCreate, ...b })), /createAddress failed/);
    }
    assert.strictEqual(calls.length, 0);
    await service.createAddress(new CreateAddressInput({ ...validCreate, latitude: 90, longitude: -180 }));
    assert.strictEqual(calls.length, 1);
});

test('createAddress throws on backend error', async () => {
    const service = new GraphqlAddressService(mockClient({ errors: [{ message: 'Unauthorized' }] }));
    await assert.rejects(() => service.createAddress(new CreateAddressInput(validCreate)), /createAddress failed: .*Unauthorized/);
});

test('createAddress throws when upsertAddress is missing', async () => {
    const service = new GraphqlAddressService(mockClient({ data: {} }));
    await assert.rejects(() => service.createAddress(new CreateAddressInput(validCreate)), /createAddress failed/);
});
