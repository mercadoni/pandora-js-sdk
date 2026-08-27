const getCategoryTreeQuery = `
  query GetCategoryTree($getCategoryInput: GetCategoryInput!) {
    getCategory(getCategoryInput: $getCategoryInput) {
      ...CategoryFields
      subCategories {
        ...CategoryFields
        subCategories {
          ...CategoryFields
          subCategories {
            ...CategoryFields
          }
        }
      }
    }
  }

  fragment CategoryFields on CategoryModel {
    active
    boost
    hasChildren
    categoryNamesPath
    isAvailableInHome
    level
    name
    path
    reference
    slug
    photoUrl
    imageUrl
    shortName
    isFeatured
    isAssociatedToCatalog
  }
`;

export default getCategoryTreeQuery;
