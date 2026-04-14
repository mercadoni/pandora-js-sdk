import Category
    from "./Category";
import StockDetail
    from "./StockDetail";

class Product {
    stock: number;
    location: string;
    price: number;
    searchKeywords: string;
    slug: string;
    brand: string;
    securityStock: number;
    boost: number;
    subQty: number;
    clickMultiplier: number;
    isAvailable: boolean;
    unit: string;
    ean: Array<string>;
    name: string;
    updatedAt: string;
    sku: string;
    minQty: number;
    maxQty: number;
    storeReference: string;
    promotion: Array<any>;
    nutritionalDetails: string;
    isActive: boolean;
    photosUrl: Array<string>;
    categories: Array<Category>;
    categoriesData: Array<Category>;
    createdAt: string;
    subUnit: string;
    description: string;
    relatedProducts: Array<Product>;
    tags: Array<string>;
    formats: Array<any>;
    lowStocks: boolean;
    ingredients: Array<string>;
    stockWarning: boolean;
    substituteProducts: Array<Product>;
    suggestedReplacementClient: Array<string>;
    suggestedReplacementModel: Array<string>;
    promoted: {
        isPromoted: boolean;
        onLoadBeacon: string;
        onViewBeacon: string;
        onClickBeacon: string;
        onBasketChangeBeacon: string;
        onWishlistBeacon: string;
        retailMediaData: any;
    };
    isFavorite: boolean;
    isSample: boolean;
    pickingMultiplier: Array<any>;
    relatedStores: Array<string>;
    lowStockThreshold: number | null;
    taxTotal: number;
    isAvailableInSearch: boolean;
    taxes: Array<any>;
    variants: any;
    specifications: Array<any>;
    priceBeforeTaxes: number;
    productUpdatedAt: string | null;
    pricePerSubUnitBeforeTaxes: number | null;
    seals: Array<any>;
    isDominant: boolean;
    nutritionalDetailsInformation: any;
    multistore: boolean;
    alwaysOn: boolean;
    stockDetails: Array<StockDetail>;
    recipes: any;
    weight: number;
    isBestSeller: boolean;
    volume: number;
    lots: {
        availableLots: Array<any>;
        isActive: boolean;
    };
    pricePerSubUnit: number | null;
    promotionsV2: any;
    claimInformation: {
        maxClaimTimeHrs: number;
        availableClaimActions: Array<any>;
    };
    isVariant: boolean;
    conditions: any;
    dimensions: {
        x: number;
        y: number;
        z: number;
    };
    bigItems: any;

    constructor(config: {
        stock: number;
        location?: string;
        price: number;
        searchKeywords?: string;
        slug: string;
        brand?: string;
        securityStock?: number;
        boost?: number;
        subQty?: number;
        clickMultiplier?: number;
        isAvailable: boolean;
        unit?: string;
        ean?: Array<string>;
        name: string;
        updatedAt?: string;
        sku: string;
        minQty: number;
        maxQty: number;
        storeReference: string;
        promotion: Array<any>;
        nutritionalDetails?: string;
        isActive: boolean;
        photosUrl: Array<string>;
        categories: Array<Category>;
        categoriesData: Array<Category>;
        createdAt?: string;
        subUnit?: string;
        description?: string;
        relatedProducts?: Array<Product>;
        tags?: Array<string>;
        formats?: Array<any>;
        lowStocks?: boolean;
        ingredients?: Array<string>;
        stockWarning?: boolean;
        substituteProducts?: Array<Product>;
        suggestedReplacementClient?: Array<any>;
        suggestedReplacementModel?: Array<any>;
        promoted?: {
            isPromoted: boolean;
            onLoadBeacon: string;
            onViewBeacon: string;
            onClickBeacon: string;
            onBasketChangeBeacon: string;
            onWishlistBeacon: string;
            retailMediaData: any;
        };
        isFavorite?: boolean;
        isSample?: boolean;
        pickingMultiplier?: Array<any>;
        relatedStores?: Array<any>;
        lowStockThreshold?: number | null;
        taxTotal?: number;
        isAvailableInSearch?: boolean;
        taxes?: Array<any>;
        variants?: any;
        specifications?: Array<any>;
        priceBeforeTaxes?: number;
        productUpdatedAt?: string | null;
        pricePerSubUnitBeforeTaxes?: number | null;
        seals?: Array<any>;
        isDominant?: boolean;
        nutritionalDetailsInformation?: any;
        multistore?: boolean;
        alwaysOn?: boolean;
        stockDetails?: Array<{
            storeReference: string;
            stock: number;
        }>;
        recipes?: any;
        weight?: number;
        isBestSeller?: boolean;
        volume?: number;
        lots?: {
            availableLots: Array<any>;
            isActive: boolean;
        };
        pricePerSubUnit?: number | null;
        promotionsV2?: any;
        claimInformation?: {
            maxClaimTimeHrs: number;
            availableClaimActions: Array<any>;
        };
        isVariant?: boolean;
        conditions?: any;
        dimensions?: {
            x: number;
            y: number;
            z: number;
        };
        bigItems?: any;
    }) {
        this.stock = config.stock;
        this.location = config.location || '';
        this.price = config.price;
        this.searchKeywords = config.searchKeywords || '';
        this.slug = config.slug;
        this.brand = config.brand || '';
        this.securityStock = config.securityStock || 0;
        this.boost = config.boost || 0;
        this.subQty = config.subQty || 0;
        this.clickMultiplier = config.clickMultiplier || 0;
        this.isAvailable = config.isAvailable;
        this.unit = config.unit || '';
        this.ean = config.ean || [];
        this.name = config.name;
        this.updatedAt = config.updatedAt || '';
        this.sku = config.sku;
        this.minQty = config.minQty;
        this.maxQty = config.maxQty;
        this.storeReference = config.storeReference;
        this.promotion = config.promotion;
        this.nutritionalDetails = config.nutritionalDetails || '';
        this.isActive = config.isActive;
        this.photosUrl = config.photosUrl;
        this.categories = config.categories ? config.categories.map((category: any) => Category.fromJson(category)) : []
        this.categoriesData = config.categoriesData ? config.categoriesData.map((categoryData: any) => Category.fromJson(categoryData)) : []
        this.createdAt = config.createdAt || '';
        this.subUnit = config.subUnit || '';
        this.description = config.description || '';
        this.relatedProducts = config.relatedProducts || [];
        this.tags = config.tags || [];
        this.formats = config.formats || [];
        this.lowStocks = config.lowStocks || false;
        this.ingredients = config.ingredients || [];
        this.stockWarning = config.stockWarning || false;
        this.substituteProducts = config.substituteProducts || [];
        this.suggestedReplacementClient = config.suggestedReplacementClient || [];
        this.suggestedReplacementModel = config.suggestedReplacementModel || [];
        this.promoted = config.promoted || {
            isPromoted: false,
            onLoadBeacon: '',
            onViewBeacon: '',
            onClickBeacon: '',
            onBasketChangeBeacon: '',
            onWishlistBeacon: '',
            retailMediaData: null
        };
        this.isFavorite = config.isFavorite || false;
        this.isSample = config.isSample || false;
        this.pickingMultiplier = config.pickingMultiplier || [];
        this.relatedStores = config.relatedStores || [];
        this.lowStockThreshold = config.lowStockThreshold || null;
        this.taxTotal = config.taxTotal || 0;
        this.isAvailableInSearch = config.isAvailableInSearch || true;
        this.taxes = config.taxes || [];
        this.variants = config.variants || null;
        this.specifications = config.specifications || [];
        this.priceBeforeTaxes = config.priceBeforeTaxes || 0;
        this.productUpdatedAt = config.productUpdatedAt || null;
        this.pricePerSubUnitBeforeTaxes = config.pricePerSubUnitBeforeTaxes || null;
        this.seals = config.seals || [];
        this.isDominant = config.isDominant || false;
        this.nutritionalDetailsInformation = config.nutritionalDetailsInformation || null;
        this.multistore = config.multistore || false;
        this.alwaysOn = config.alwaysOn || false;
        this.stockDetails = config.stockDetails || [];
        this.recipes = config.recipes || null;
        this.weight = config.weight || 0;
        this.isBestSeller = config.isBestSeller || false;
        this.volume = config.volume || 0;
        this.lots = config.lots || {
            availableLots: [],
            isActive: false
        };
        this.pricePerSubUnit = config.pricePerSubUnit || null;
        this.promotionsV2 = config.promotionsV2 || null;
        this.claimInformation = config.claimInformation || {
            maxClaimTimeHrs: 0,
            availableClaimActions: []
        };
        this.isVariant = config.isVariant || false;
        this.conditions = config.conditions || null;
        this.dimensions = config.dimensions || {
            x: 0,
            y: 0,
            z: 0
        };
        this.bigItems = config.bigItems || null;
    }

    static fromJson(json: Record<string, any>): Product {

        return new Product({

            stock: json.stock || 0,
            location: json.location,
            price: json.price || 0,
            searchKeywords: json.searchKeywords,
            slug: json.slug || 0,
            brand: json.brand,
            securityStock: json.securityStock,
            boost: json.boost,
            subQty: json.subQty,
            clickMultiplier: json.clickMultiplier,
            isAvailable: json.isAvailable || false,
            unit: json.unit,
            ean: json.ean,
            name: json.name || '',
            updatedAt: json.updatedAt,
            sku: json.sku || '',
            minQty: json.minQty || 0,
            maxQty: json.maxQty || 0,
            storeReference: json.storeReference || '',
            promotion: json.promotion || [],
            nutritionalDetails: json.nutritionalDetails,
            isActive: json.isActive || false,
            photosUrl: json.photosUrl || [],
            createdAt: json.createdAt,
            subUnit: json.subUnit,
            description: json.description,
            tags: json.tags,
            formats: json.formats,
            lowStocks: json.lowStocks,
            ingredients: json.ingredients,
            stockWarning: json.stockWarning,
            promoted: json.promoted,
            isFavorite: json.isFavorite,
            isSample: json.isSample,
            pickingMultiplier: json.pickingMultiplier,
            relatedStores: json.relatedStores,
            lowStockThreshold: json.lowStockThreshold,
            taxTotal: json.taxTotal,
            isAvailableInSearch: json.isAvailableInSearch,
            taxes: json.taxes,
            variants: json.variants,
            specifications: json.specifications,
            priceBeforeTaxes: json.priceBeforeTaxes,
            productUpdatedAt: json.productUpdatedAt,
            pricePerSubUnitBeforeTaxes: json.pricePerSubUnitBeforeTaxes,
            seals: json.seals,
            isDominant: json.isDominant,
            nutritionalDetailsInformation: json.nutritionalDetailsInformation,
            multistore: json.multistore,
            alwaysOn: json.alwaysOn,
            stockDetails: json.stockDetails,
            recipes: json.recipes,
            weight: json.weight,
            isBestSeller: json.isBestSeller,
            volume: json.volume,
            lots: json.lots,
            pricePerSubUnit: json.pricePerSubUnit,
            promotionsV2: json.promotionsV2,
            claimInformation: json.claimInformation,
            isVariant: json.isVariant,
            conditions: json.conditions,
            dimensions: json.dimensions,
            bigItems: json.bigItems,
            categories: Array.isArray(json.categories) ? json.categories.map(category => Category.fromJson(category))
                .filter(category => category !== null) : [],
            categoriesData: Array.isArray(json.categoriesData) ? json.categoriesData.map(category => Category.fromJson(category))
                .filter(category => category !== null) : [],
        })
    }
}

export default Product;