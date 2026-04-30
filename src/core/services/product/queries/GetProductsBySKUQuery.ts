const getProductsBySKUQuery = `query GetProductsBySKU($getProductsBySKUInput: GetProductsBySKUInput!) {
  getProductsBySKU(getProductsBySKUInput: $getProductsBySKUInput) {
    sku
    name
    price
    unit
    subUnit
    subQty
    photosUrl
    stock
    isAvailable
    isActive
    maxQty
    minQty
    slug
    brand
    description
    securityStock
    stockWarning
    boost
    clickMultiplier
    isVariant
    isDominant
    ean
    nutritionalDetails
    priceBeforeTaxes
    taxTotal
    relatedProducts
    ingredients
    allowSubstitutions
    type
    location
    previousPrice
    previousPricePerSubUnit
    pricePerSubUnit
    promotionPricePerSubUnit
    hasAgeRestriction
    metaDescription
    metaTitle
    availableOperationalModel
    specifications {
      title
      values {
        label
        value
      }
    }
    categoriesData {
      name
      reference
      level
      path
      hasChildren
      active
      boost
      isAvailableInHome
      slug
      categoryNamesPath
      isAssociatedToCatalog
      hasAgeRestriction
      metaDescription
      metaTitle
    }
    categories {
      name
      reference
      level
      path
      hasChildren
      active
      boost
      isAvailableInHome
      slug
      categoryNamesPath
      isAssociatedToCatalog
      hasAgeRestriction
      metaDescription
      metaTitle
    }
    tags {
      description
      enabled
      textColor
      filter
      tagReference
      backgroundColor
      name
    }
    promotion {
      type
      isActive
      description
      endDateTime
      startDateTime
      isApplied
      conditions {
        quantity
        price
        priceBeforeTaxes
        taxTotal
      }
    }
    promotions {
      type
      description
      promotionReference
      startDateTime
      endDateTime
      isActive
    }
    formats {
      format
      equivalence
      unitEquivalence
      clickMultiplier
      minQty
      maxQty
    }
    variants {
      id
      modifications {
        ean
        name
        stock
        photosUrl
      }
      types {
        name
        value
      }
    }
  }
}`;

export default getProductsBySKUQuery;
