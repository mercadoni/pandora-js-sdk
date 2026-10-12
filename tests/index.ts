import { readdirSync } from 'fs';
import { join } from 'path';
import { runTests } from './harness';

/** Discovers and imports every tests/*.test.ts file (sorted), then runs all registered tests. */
(async () => {
    const files = readdirSync(__dirname)
        .filter((f) => f.endsWith('.test.ts'))
        .sort();
    for (const f of files) {
        await import(join(__dirname, f));
    }
    await runTests();
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
