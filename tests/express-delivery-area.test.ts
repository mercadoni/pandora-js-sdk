import assert from 'assert';
import GraphqlFulfillmentService from '../src/core/services/fulfillment/GraphqlFulfillmentService';
import ExpressDeliveryAreaDetailsFilter from '../src/core/services/fulfillment/ExpressDeliveryAreaDetailsFilter';
import ExpressDeliveryAreaDetailsModel from '../src/core/models/fulfillment/ExpressDeliveryAreaDetailsModel';
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

const coords = { latitude: 4.711, longitude: -74.072 };

test('returns ExpressDeliveryAreaDetailsModel with available=true', async () => {
    const { client } = mockClient({ data: { expressDeliveryAreaDetails: { available: true } } });

    const result = await new GraphqlFulfillmentService(client).getExpressDeliveryAreaDetails(
        new ExpressDeliveryAreaDetailsFilter({ clientId: 'c1', storeReference: 'store-1', coordinates: coords }),
    );

    assert.ok(result instanceof ExpressDeliveryAreaDetailsModel);
    assert.strictEqual(result.available, true);
});

test('returns available=false when outside express area', async () => {
    const { client } = mockClient({ data: { expressDeliveryAreaDetails: { available: false } } });

    const result = await new GraphqlFulfillmentService(client).getExpressDeliveryAreaDetails(
        new ExpressDeliveryAreaDetailsFilter({ clientId: 'c1', storeReference: 'store-1', coordinates: coords }),
    );

    assert.strictEqual(result.available, false);
});

test('sends expressDeliveryAreaDetailsInput as a single nested variable', async () => {
    const { client, calls } = mockClient({ data: { expressDeliveryAreaDetails: { available: true } } });

    await new GraphqlFulfillmentService(client).getExpressDeliveryAreaDetails(
        new ExpressDeliveryAreaDetailsFilter({ clientId: 'c1', storeReference: 'store-1', coordinates: coords }),
    );

    assert.deepStrictEqual(calls[0].variables, {
        expressDeliveryAreaDetailsInput: { clientId: 'c1', storeReference: 'store-1', coordinates: coords },
    });
    assert.ok(calls[0].gql.includes('expressDeliveryAreaDetails'));
});

test('throws without exposing coordinates when backend returns errors', async () => {
    const { client } = mockClient({ errors: [{ message: 'store not found' }] });

    await assert.rejects(
        new GraphqlFulfillmentService(client).getExpressDeliveryAreaDetails(
            new ExpressDeliveryAreaDetailsFilter({ clientId: 'c1', storeReference: 'store-1', coordinates: coords }),
        ),
        (err: Error) => {
            assert.match(err.message, /expressDeliveryAreaDetails failed/);
            assert.ok(!err.message.includes('4.711'), 'error must not contain coordinates');
            assert.ok(!err.message.includes('-74.072'), 'error must not contain coordinates');
            return true;
        },
    );
});
