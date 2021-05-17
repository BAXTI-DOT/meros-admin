import { gql } from '@apollo/client'

const ADD_SUBCLASS = gql`
  mutation addSubclass($subclassName: String! $subcategoryID: ID! $categoryID: ID!) {
    addSubclass(subclassName: $subclassName subcategoryID: $subcategoryID categoryID: $categoryID)
  }
`

const NEW_FILTER = gql`
    mutation createFilter($title: String! $subcategoryID: ID!) {
        createFilter(title: $title subcategoryID: $subcategoryID)
    }
`

const DELETE_FILTER = gql`
    mutation deleteFilter($filterID: ID!) {
        deleteFilter(filterID: $filterID)
    }
`

const FILTER_DETAILS = gql`
    query filterDetails($filterID: ID!) {
        filterDetails(filterID: $filterID) {
            id
            name
        }
    }
`

const NEW_DETAIL = gql`
    mutation newDetail($title: String! $filterID: ID!) {
        newDetail(title: $title filterID: $filterID) 
    }
`

export {
    ADD_SUBCLASS,
    NEW_FILTER,
    DELETE_FILTER,
    FILTER_DETAILS,
    NEW_DETAIL
}