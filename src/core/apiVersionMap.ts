export type ApiVersion = 'v2' | 'v3';

export type ApiService = 'home' | 'auth' | 'cart' | 'product' | 'category' | 'fulfillment' | 'address';

/**
 * Backend compatibility contract. Keep version ownership here rather than in
 * consuming applications: Deadpool still serves fulfillment from v2 while
 * the other current services use v3.
 */
export const API_VERSION_BY_SERVICE: Readonly<Record<ApiService, ApiVersion>> = {
    home: 'v3',
    auth: 'v3',
    cart: 'v3',
    product: 'v3',
    category: 'v3',
    fulfillment: 'v2',
    address: 'v3',
};

const VERSION_SUFFIX = /\/v\d+$/;

export function versionedApiUrl(baseUrl: string, version: ApiVersion): string {
    const normalized = baseUrl.replace(/\/+$/, '');
    return VERSION_SUFFIX.test(normalized)
        ? normalized.replace(VERSION_SUFFIX, `/${version}`)
        : `${normalized}/${version}`;
}
