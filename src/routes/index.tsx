import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

const Routes: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path="/login"
                    component={React.lazy(() => import('@/pages/Login'))}
                />
                <Route
                    path="/home"
                    component={React.lazy(() => import('@/pages/Home'))}
                />
                <Route
                    path="/"
                    component={React.lazy(() => import('@/pages/Home'))}
                />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes
