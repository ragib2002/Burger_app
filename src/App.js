import React, { Component } from "react";
import "./App.css";
import Layout from "./Layout";
import BurgerBuilder from "./BurgerBuilder";
import { Route, Switch, Redirect } from "react-router-dom";
import Logout from "./Logout";
import { connect } from "react-redux";
import * as actionTypes from "./actions/Auth";
import asyncComponent from "./asyncComponent";

const asyncCheckout = asyncComponent(() => {
    return import("./Checkout");
});

const asyncOrders = asyncComponent(() => {
    return import("./Orders");
});

const asyncAuth = asyncComponent(() => {
    return import("./Auth");
});

class App extends Component {
    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token) {
            const userId = localStorage.getItem("userId");
            const expirationDate = new Date(
                localStorage.getItem("expirationDate")
            );
            if (new Date() < expirationDate) {
                this.props.onTryAutoSingup(token, userId);
                setTimeout(() => {
                    this.props.onlogout();
                }, expirationDate.getTime() - new Date().getTime());
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("expirationDate");
            }
        }
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/auth" component={asyncAuth} />
                <Route path="/" exact component={BurgerBuilder} />
                <Redirect to="/" />
            </Switch>
        );

        if (this.props.isAuth) {
            routes = (
                <Switch>
                    <Route path="/checkout" component={asyncCheckout} />
                    <Route path="/auth" component={asyncAuth} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/orders" component={asyncOrders} />
                    <Route path="/" exact component={BurgerBuilder} />
                    <Redirect to="/" />
                </Switch>
            );
        }
        return (
            <div>
                <Layout>{routes}</Layout>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.token !== null,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSingup: (token, userId) =>
            dispatch(actionTypes.authSuccess(token, userId)),
        onlogout: () => dispatch(actionTypes.authLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
