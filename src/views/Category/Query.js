import { gql } from '@apollo/client'


const ALL_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`

const SUBSCRIPTION = gql`
  subscription {
    categories {
      id
      name
    }
  }
`

const SUBSCRIPTION2 = gql`
	subscription {
		navbar {
			id
			name
		}
	}
`

const ADD_CATEGORY = gql`
  mutation addCategory($categoryName: String! $isNavbar: Boolean $isPopular: Boolean) {
    addCategory(categoryName: $categoryName isNavbar: $isNavbar isPopular: $isPopular)
  }
`
const DELETE_CATEGORY = gql`
  mutation deleteCategory($categoryID: ID!) {
    deleteCategory(categoryID: $categoryID)
  }
`

const DELETE_NAVBAR = gql`
  mutation deleteFromNavbar($categoryID: ID!) {
    deleteFromNavbar(categoryID: $categoryID)
  }
`

const NAVBAR = gql`
  query {
    navbar {
      id
      name
    }
  }
`

const ADD_TO_NAVBAR = gql`
  mutation addToNavbar($categoryID: ID!) {
    addToNavbar(categoryID: $categoryID)
  }
`

const UPDATE_CATEGORY = gql`
  mutation updateCategory($categoryID: ID! $categoryName: String! $isNavbar: Boolean $isPopular: Boolean) {
    updateCategory(categoryID: $categoryID categoryName: $categoryName isNavbar: $isNavbar isPopular: $isPopular)
  }
`

const BY_CATEGORY_ID = gql`
  query byCategoryID($categoryID: ID!) {
    byCategoryID(categoryID: $categoryID) {
      id
      name
      isNavbar
      isPopular
    }
  }
`

export {
    ALL_CATEGORIES,
    SUBSCRIPTION,
    SUBSCRIPTION2,
    ADD_CATEGORY,
    ADD_TO_NAVBAR,
    NAVBAR,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    DELETE_NAVBAR,
    BY_CATEGORY_ID
}