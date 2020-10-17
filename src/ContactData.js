import React, { Component } from "react";
import Button from "./Button";
import classes from "./ContactData.module.css";
import axios from "./axios-orders";
import Spinner from "./Spinner";
import Input from "./Input";
import { connect } from "react-redux";
import withErrorHandler from "./withErrorHandler";
import * as actions from "./actions/order";

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Your Name ",
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: false,
                isTouched: false,
            },
            street: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Street",
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: false,
                isTouched: false,
            },
            zipCode: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "ZIP",
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                },
                valid: false,
                isTouched: false,
            },
            country: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "country",
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: false,
                isTouched: false,
            },
            email: {
                elementType: "input",
                elementConfig: {
                    type: "email",
                    placeholder: "Email",
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: false,
                isTouched: false,
            },
            deleveryMethod: {
                elementType: "select",
                elementConfig: {
                    options: [
                        { value: "fastest", displayValue: "Fastest" },
                        { value: "cheapest", displayValue: "Cheapest" },
                    ],
                },
                validation: {},
                value: "fastest",
                valid: true,
                isTouched: false,
            },
        },
        formIsValid: false,
        loading: false,
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[
                formElementIdentifier
            ].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId,
        };

        axios
            .post("/orders.json?auth=" + this.props.token, order)
            .then((response) => {
                this.props.onOrderBurger(response.data.name, order);
                this.setState({ loading: false });
                this.props.history.push("/");
            })
            .catch((error) => {
                this.props.onFailed(error);
                this.setState({ loading: false });
            });
    };

    checkValidity = (value, rules) => {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== "" && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.minLength) {
            isValid = value.length <= rules.minLength && isValid;
        }

        return isValid;
    };

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedform = { ...this.state.orderForm };
        const updated = { ...updatedform[inputIdentifier] };
        updated.value = event.target.value;
        updated.valid = this.checkValidity(updated.value, updated.validation);
        updated.isTouched = true;
        updatedform[inputIdentifier] = updated;

        let formIsValid = true;
        for (let inputIdentifier in updatedform) {
            formIsValid = updatedform[inputIdentifier].valid && formIsValid;
        }

        this.setState({ orderForm: updatedform, formIsValid: formIsValid });
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key],
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map((formElement) => (
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
                ))}
                <Button disabled={!this.state.formIsValid} btnType="Success">
                    ORDER
                </Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter you contact data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        token: state.auth.token,
        userId: state.auth.userId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onOrderBurger: (id, order) =>
            dispatch(actions.purchaseBurgerSuccess(id, order)),
        onFailed: (error) => dispatch(actions.purchaseBurgerFail(error)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withErrorHandler(ContactData, axios));
