const getProductsByCategoryQuery = `
  query GetProductsByCategory($getProductsByCategoryInput: GetProductsByCategoryInput!) {
    getProductsByCategory(getProductsByCategoryInput: $getProductsByCategoryInput) {
      category {
        level
        hasChildren
        name
        active
        slug
        categoryNamesPath
        imageUrl
        shortName
        isFeatured
        products {
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
          priceBeforeTaxes
          taxTotal
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
        }
      }
      pagination {
        page
        pages
        total {
          value
          relation
        }
      }
      aggregates {
        name
        docCount
        isFromSpecification
        buckets {
          min
          max
          key
          docCount
        }
      }
      carousels {
        id
        name
        autoplaySpeed
        lazyLoading
        isActive
        position
        banners {
          id
          name
          webImageUrl
          tabletImageUrl
          appImageUrl
          redirectUrl
          redirectMode
          isActive
        }
      }
      promoted {
        isPromoted
        onLoadBeacon
        onViewBeacon
        onClickBeacon
        onBasketChangeBeacon
        onWishlistBeacon
      }
    }
  }
`;

export default getProductsByCategoryQuery;
