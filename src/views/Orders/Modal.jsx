import { useMutation, useQuery } from '@apollo/client'
import { ADDRESS_DETAILS, ORDER_DETAILS, SUBMIT_ORDER, SUM, USER_DETAILS } from './Query'

import {
    Button as MatButton,
    Modal, 
    ModalHeader, 
    ModalBody, 
    Label,
    Form,
    Col,
    Row
  } from "reactstrap"
  
import { useSnackbar } from 'notistack'
import { useState } from 'react'

function OrderModal ({toggle, modal, orderID, setModal }) {

    const [ variant ] = useState("success")

    const { enqueueSnackbar } = useSnackbar()

    const { data } = useQuery(USER_DETAILS, {
        variables: { orderID }
    })

    const { data: address } = useQuery(ADDRESS_DETAILS, {
        variables: { orderID }
    })

    const { data: details } = useQuery(ORDER_DETAILS, {
        variables: { orderID }
    })

    const { data: sum } = useQuery(SUM, {
        variables: { orderID }
    })

    const [ submit ] = useMutation(SUBMIT_ORDER, {
        errorPolicy: "all",
        update: (cache, data) => {
            enqueueSnackbar("Successful submit", { variant })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        submit({
            variables: {
                orderID
            }
        })

        setModal(!modal)
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Order details</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <Row sm="12">
                        <Col>
                            <Label>User name</Label>
                            {
                                data && 
                                <h4 type="text" style={{"color": "black"}} name="select">{data.orderUsers.name}</h4>
                            }
                        </Col>
                        <Col>
                            <Label>User number</Label>
                            {
                                data && 
                                <h4 type="text" style={{"color": "black"}} name="select">{data.orderUsers.number}</h4>
                            }
                        </Col>
                    </Row>
                    <Row sm="12">
                        <Col>
                            <Label>State</Label>
                            {
                                address && 
                                <h4 type="text" style={{"color": "black"}} name="select">{address.orderAddress.state}</h4>
                            }
                        </Col>
                        <Col>
                            <Label>Region</Label>
                            {
                                address && 
                                <h4 type="text" style={{"color": "black"}} name="select">{address.orderAddress.region}</h4>

                            }
                        </Col>
                    </Row>
                    <Label>Address</Label>
                    {
                        address && 
                        <h4 type="text" style={{"color": "black"}} name="select">{address.orderAddress.address}</h4>

                    }
                     <Row sm="12">
                        <Col>
                            <Label>Additional name</Label>
                            {
                                address && 
                                 <h4 type="text" style={{"color": "black"}} name="select">{address.orderAddress.fullName}</h4>
                            }
                        </Col>
                        <Col>
                            <Label>Additional number</Label>
                            {
                                address && 
                                <h4 type="text" style={{"color": "black"}} name="select">{address.orderAddress.phone}</h4>
                            }
                        </Col>
                    </Row>
                    <Label>Product description</Label>
                        {
                            details && details.orderDetails.map((e, i) => (
                                <Row key={i} style={{"justifyContent": "space-between"}}>
                                    <div style={{"objectFit": "cover", "width": "200px", "height": "200px"}}>
                                        <Label>Image</Label>
                                        <img src={e.productImage} alt="" />
                                    </div>
                                    <Col>
                                        <Label>Name</Label>
                                        <h4 style={{"color": "black"}}>{e.productName}</h4>
                                    </Col>
                                    <Col>
                                        <Label>Count</Label>
                                        <h4 style={{"color": "black"}}>{e.productCount}</h4>
                                    </Col>
                                    <Col>
                                        <Label>Price</Label>
                                        <h4 style={{"color": "black"}}>{e.productPrice}</h4>
                                    </Col>
                                </Row>
                            ))
                        }
                    <Row>
                        <Col>
                            <Label>Overall sum</Label>
                            {
                                sum &&
                                <h1 style={{"color": "black"}}>{sum.getOrderSum} sum</h1>
                            }
                        </Col>
                    </Row>
                    <MatButton type="submit" style={{"margin": "0 auto", "marginTop": "50px", "marginBottom": "40px", "width": "100%"}} color="primary">Received</MatButton>{' '}
                </Form>
            </ModalBody>
        </Modal>
    )
}

export default OrderModal