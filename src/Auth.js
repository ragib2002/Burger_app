import React, { Component } from "react";
import Input from "./Input";
import Button from "./Button";
import classes from "./Auth.module.css";
import * as actionTypes from "./actions/Auth";
import { connect } from "react-redux";
import axios from "axios";
import Spinner from "./Spinner";
import { Redirect } from "react-router-dom";

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: "input",
                elementConfig: {
                    type: "email",
                    placeholder: "Mail Address",
                },
                value: "",
                validation: {
                    required: true,
                    isEmail: true,
                },
                valid: false,
                isTouched: false,
            },
            password: {
                elementType: "input",
                elementConfig: {
                    type: "password",
                    placeholder: "Password",
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 6,
                },
                valid: false,
                isTouched: false,
            },
        },
        isSignup: true,
        loading: false,
        error: null,
    };

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== "/") {
            this.props.onSetAuthRedirectPath();
        }
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== "" && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid;
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(
                    event.target.value,
                    this.state.controls[controlName].validation
                ),
                isTouched: true,
            },
        };
        this.setState({ controls: updatedControls });
    };

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        this.props.onAuthStart();
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value,
            returnSecureToken: true,
        };

        let url =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBaPo4teJ0WScelHf_wlVEjlPwYCPr6jUw";

        if (!this.state.isSignup) {
            url =
                "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBaPo4teJ0WScelHf_wlVEjlPwYCPr6jUw";
        }
        axios
            .post(url, authData)
            .then((response) => {
                const expirationDate = new Date(
                    new Date().getTime() + response.data.expiresIn * 1000
                );
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("expirationDate", expirationDate);
                localStorage.setItem("userId", response.data.localId);
                this.props.onAuthSuccess(
                    response.data.idToken,
                    response.data.localId
                );
                setTimeout(() => {
                    this.props.onLogout();
                }, response.data.expiresIn * 1000);
                this.setState({ loading: false });
            })
            .catch((err) => {
                this.setState({
                    loading: false,
                    error: err.response.data.error,
                });
            });
    };

    switchAuthModeHandler = () => {
        this.setState((prevState) => {
            return {
                isSignup: !prevState.isSignup,
                error: null,
            };
        });
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key],
            });
        }

        let form = formElementsArray.map((formElement) => (
            <Input
                key={formElement.id}
                elementtype={formElement.config.elementType}
                elementconfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                touched={formElement.config.isTouched}
                changed={(event) =>
                    this.inputChangedHandler(event, formElement.id)
                }
            />
        ));

        if (this.state.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;
        if (this.state.error) {
            errorMessage = <p>{this.state.error.message}</p>;
        }

        let authRedirect = null;
        if (this.props.isAuth) {
            console.log(this.props.authRedirectPath);
            authRedirect = <Redirect to={this.props.authRedirectPath} />;
        }
        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">Submit</Button>
                </form>
                <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
                    Switch to {this.state.isSignup ? "sign in" : "sign up"}
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.token !== null,
        buildingBurger: state.building,
        authRedirectPath: state.auth.authRedirectPath,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAuthStart: () => dispatch(actionTypes.authStart()),
        onAuthSuccess: (token, userId) =>
            dispatch(actionTypes.authSuccess(token, userId)),
        onLogout: () => dispatch(actionTypes.authLogout()),
        onSetAuthRedirectPath: () =>
            dispatch(actionTypes.setAuthRedirectPath("/")),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
