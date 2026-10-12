/** Optional narrowing of nearby stores. All fields are optional strings. */
type LocationFilter = {
    city?: string;
    state?: string;
    kind?: string;
};

export default LocationFilter;
