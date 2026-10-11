import assert from 'assert';
import { test } from './harness';

test('harness runs sync and async cases', async () => {
    assert.strictEqual(1 + 1, 2);
    await Promise.resolve();
});
