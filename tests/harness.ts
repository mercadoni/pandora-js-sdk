export type TestFn = () => void | Promise<void>;

const tests: Array<[string, TestFn]> = [];

/** Registers a test case. Cases run in registration order via runTests(). */
export function test(name: string, fn: TestFn): void {
    tests.push([name, fn]);
}

/** Runs every registered test, prints a summary and sets exit code 1 on any failure. */
export async function runTests(): Promise<void> {
    let failed = 0;
    for (const [name, fn] of tests) {
        try {
            await fn();
            console.log(`ok   ${name}`);
        } catch (e) {
            failed++;
            console.error(`FAIL ${name}\n${e}`);
        }
    }
    console.log(`${tests.length - failed}/${tests.length} passed`);
    if (failed) process.exitCode = 1;
}
