import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useLogin } from '../contexts/Auth'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
} from "reactstrap";
import logo from '../assets/img/react-logo.png'
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

const LOGIN = gql`
    mutation adminLogin($username: String! $password: String!) {
        adminLogin(username: $username password: $password)
    }
`

export default function Auth(props) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ token, setToken ] = useLogin()

    const [ login, { error } ] = useMutation(LOGIN, {
        errorPolicy: "all",
        update: (cache, data) => {
            console.log(data)
            if(data) {
                setToken(data.data.adminLogin)
            }
        }
    })

    const handleLogin = (e) => {
        e.preventDefault()

        login({
            variables: {
                username,
                password
            }
        })
    }

    if(token) return <Redirect to="/admin" />

    return(
        <>
            <div className="container pt-5">
                <Row className="mt-5">
                    <Col md="6" className="mt-5 mx-auto">
                        <Card md="12">
                            <CardHeader className="pt-md-4 mx-auto">
                                <img src={logo} alt="ki" />
                                <h3 className="title mb-0">Login</h3>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleLogin}>
                                    <Row className="mx-auto" md="8">
                                        <Col className="pr-md-3 mx-auto" md="12">
                                <h3 style={{"color": "red"}}>{error ? error.message: null}</h3>
                                            <FormGroup>
                                                <label>Username:</label>
                                                <Input
                                                onKeyUp={(e)=>setUsername(e.target.value)}
                                                defaultValue=""
                                                placeholder="Username"
                                                type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col className="pr-md-3 mx-auto" md="12">
                                            <FormGroup>
                                                <label>Password:</label>
                                                <Input
                                                onKeyUp={(e)=>setPassword(e.target.value)}
                                                defaultValue=""
                                                placeholder="Password"
                                                type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col className="d-flex justify-content-center align-items-center pr-md-3 mx-auto" md="12">
                                            <Button className="btn-fill" color="primary" type="submit">
                                                Login
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}