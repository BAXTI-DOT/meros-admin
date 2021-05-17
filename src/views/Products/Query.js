import { gql } from '@apollo/client'

const ALL_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`
const ALL_SUBCATEGORIES = gql`
  query subcategories($categoryID: ID!) {
    subcategories(categoryID: $categoryID) {
      id
      name
    }
  }
`
const SUBCLASSES = gql`
  query subclasses($categoryID: ID! $subcategoryID: ID!) {
    subclasses(categoryID: $categoryID subcategoryID: $subcategoryID) {
      id
      name
    }
  }
`
const PRODUCTS = gql`
  query products($categoryID: ID! $subcategoryID: ID! $subclassID: ID! $page: Int! $limit: Int!) {
    products(categoryID: $categoryID subcategoryID: $subcategoryID subclassID: $subclassID page: $page limit: $limit) {
      id
      name
    }
  }
`
const FILTERS = gql`
  query filters($subcategoryID: ID!) {
    filters(subcategoryID: $subcategoryID) {
      id
      name
      detail {
        id
        name
      }
    }
  }
`
const COUNT = gql`
  query countOfProducts($categoryID: ID! $subcategoryID: ID! $subclassID: ID! $limit: Int!) {
    countOfProducts(categoryID: $categoryID subcategoryID: $subcategoryID subclassID: $subclassID limit: $limit)
  }
`
const CREATE_PRODUCT = gql`
  mutation createProduct(
    $productID: ID!
    $categoryID: ID! 
    $subcategoryID: ID! 
    $subclassID: ID! 
    $name: String! 
    $price: Int! 
    $isGift: Boolean 
    $isRecommended: Boolean 
    $isNew: Boolean 
    $isBest: Boolean 
    $isSale: Boolean 
    $sale: Int! 
    $amount: Int!
    $definition: String!) {
    createProduct(
      productID: $productID
      categoryID: $categoryID 
      subcategoryID: $subcategoryID 
      subclassID: $subclassID 
      name: $name 
      price: $price
      isGift: $isGift
      isRecommended: $isRecommended 
      isNew: $isNew 
      isBest: $isBest 
      isSale: $isSale 
      sale: $sale
      amount: $amount
      definition: $definition
    )
  }
`
const PRODUCT_ID = gql`
  query {
    productID
  }
`
const EDIT_FILTERS = gql`
  query editFilters($productID: ID!) {
    editFilters(productID: $productID) {
      id
      name
      oldDetail {
        id
        filteredID
        name
      }
      detail {
        id
        name
      }
    }
  }
`

const EDIT_PRODUCTS = gql`
  query editProducts($productID: ID!) {
    editProducts(productID: $productID) {
      id
      name
      price
      sale
      amount
      definition
      isNew
      isSale
      isGift
      isBest
      isRecommended
      category {
        id
        name
      }
      subcategory {
        id
        name
      }
      subclass {
        id
        name
      }
    }
  }
`

const PRODUCT_IMAGES = gql`
  query getImage($productID: ID!) {
    getImage(productID: $productID) {
      id
      url
    }
  }
`

const UPDATE_PRODUCT = gql`
  mutation updateProduct(
    $productID: ID!
    $categoryID: ID
    $subcategoryID: ID
    $subclassID: ID
    $name: String
    $price: Int
    $isGift: Boolean
    $isRecommended: Boolean
    $isNew: Boolean
    $isBest: Boolean
    $isSale: Boolean
    $sale: Int
    $amount: Int
    $definition: String
  ) {
    updateProduct(
      productID: $productID
      categoryID: $categoryID
      subcategoryID: $subcategoryID
      subclassID: $subclassID
      name: $name
      price: $price
      isGift: $isGift
      isRecommended: $isRecommended
      isNew: $isNew
      isBest: $isBest
      isSale: $isSale
      sale: $sale
      amount: $amount
      definition: $definition
    )
  }
`

const DELETE_PRODUCT = gql`
  mutation deleteProduct($productID: ID!) {
    deleteProduct(productID: $productID)
  }
`
const UPLOAD_IMAGE_PRODUCT = gql`
  mutation insertImage(
    $id: ID!
    $url: String!
  ) {
    insertImage(input: 
      {
        id: $id
        url: $url
      }
    )
  }
`

const UPDATE_IMAGE = gql`
  mutation updateImage(
    $id: ID!
    $name: String!
    $path: String!
    $mimetype: String!
    $url: String!
  ) {
    updateImage(input: 
      {
        id: $id
        name: $name
        path: $path
        mimetype: $mimetype
        url: $url
      }
    )
  }
`

export {
    ALL_CATEGORIES,
    ALL_SUBCATEGORIES,
    SUBCLASSES,
    PRODUCTS,
    FILTERS,
    COUNT,
    CREATE_PRODUCT,
    PRODUCT_ID,
    EDIT_FILTERS,
    EDIT_PRODUCTS,
    PRODUCT_IMAGES,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    UPLOAD_IMAGE_PRODUCT,
    UPDATE_IMAGE
}