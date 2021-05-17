import { gql } from '@apollo/client'

const ORDERS = gql`
    query {
        getOrder {
            id
            orderStatus
            orderNumber
            createdAt
        }
    }
`

const USER_DETAILS = gql`
    query orderUsers($orderID: ID!) {
        orderUsers(orderID: $orderID) {
            id
            name
            number
            }
    }
`

const ADDRESS_DETAILS = gql`
    query orderAddress($orderID: ID!) {
        orderAddress(orderID: $orderID) {
            state
            region
            address
            fullName
            phone
        }
    }
`

const ORDER_DETAILS = gql`
    query orderDetails($orderID: ID!) {
        orderDetails(orderID: $orderID) {
            id
            productID
            productName
            productCount
            productPrice
            productImage
        }
    }
`

const SUM = gql`
    query getOrderSum($orderID: ID!) {
        getOrderSum(orderID: $orderID)
    }
`

const SUBMIT_ORDER = gql`
    mutation submitOrder($orderID: ID!) {
        submitOrder(orderID: $orderID)
    }
`
const SUBSCRIPTION = gql`
    subscription {
        getOrder {
            id
            orderStatus
            orderNumber
            createdAt
        }
    }
`

export {
    ORDERS,
    USER_DETAILS,
    ADDRESS_DETAILS,
    ORDER_DETAILS,
    SUM,
    SUBMIT_ORDER,
    SUBSCRIPTION
}