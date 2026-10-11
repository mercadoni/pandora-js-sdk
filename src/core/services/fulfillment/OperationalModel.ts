/**
 * Known operational models. The `(string & {})` member keeps arbitrary strings
 * assignable so existing callers are not broken, while editors still suggest
 * the two known values.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type OperationalModel = 'DELIVERY' | 'PICK_AND_COLLECT' | (string & {});

export default OperationalModel;
