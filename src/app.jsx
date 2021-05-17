import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import AdminLayout from "layouts/Admin/Admin"
import Login from 'views/Login'

export default function App() {    
    return(
        <>
         <Switch>
            <Route path="/admin" component={AdminLayout} />
            <Route path="/login" component={Login} />
            <Redirect from='*' to='/admin' />
        </Switch>
        </>
    )
}