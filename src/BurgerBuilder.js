import React, { Component } from "react";
import Aux from "./Ax";
import Burger from "./Burger";
import { connect } from "react-redux";
import BuildControls from "./BuildControls";
import Modal from "./Modal";
import OrderSummary from "./OrderSummary";
import Spinner from "./Spinner";
import withErrorHandler from "./withErrorHandler";
import * as burgerBuilderActions from "./actions/index";
import axios from "./axios-orders";
import * as actions from "./actions/Auth";

class BurgerBuilder extends Component {
    state = {
        perchasing: false,
    };

    componentDidMount() {
        axios
            .get(
                "https://react-my-burgur-3f281.firebaseio.com/ingredients.json"
            )
            .then((response) => {
                this.props.onInitIngredients(response.data);
            })
            .catch((error) => {
                this.props.onerror();
            });
    }

    updatePerchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    }

    perchaseHandler = () => {
        if (this.props.isAuth) {
            this.setState({ perchasing: true });
        } else {
            this.props.onSetAuthRedirectPath("/checkout");
            this.props.history.push("/auth");
        }
    };

    perchaseCancelHandler = () => {
        this.setState({ perchasing: false });
    };

    perchaseContinueHandler = () => {
        this.props.history.push("/checkout");
    };

    render() {
        const disableInfo = {
            ...this.props.ings,
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }

        let orderSummary = null;
        let burgur = this.props.error ? (
            <p>ingredients cant be loaded</p>
        ) : (
            <Spinner />
        );

        if (this.props.ings) {
            burgur = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        perchasable={this.updatePerchaseState(this.props.ings)}
                        disabled={disableInfo}
                        price={this.props.price}
                        ordered={this.perchaseHandler}
                        isAuth={this.props.isAuth}
                    />
                </Aux>
            );

            orderSummary = (
                <OrderSummary
                    ingredients={this.props.ings}
                    price={this.props.price.toFixed(2)}
                    perchaseCancelled={this.perchaseCancelHandler}
                    perchaseContinued={this.perchaseContinueHandler}
                />
            );
        }

        return (
            <Aux>
                <Modal
                    show={this.state.perchasing}
                    modalClosed={this.perchaseCancelHandler}
                >
                    {orderSummary}
                </Modal>
                {burgur}
            </Aux>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) =>
            dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) =>
            dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: (ingredients) =>
            dispatch(burgerBuilderActions.setIngredients(ingredients)),
        onerror: () => dispatch(burgerBuilderActions.fetchIngredientsFailed()),
        onSetAuthRedirectPath: (path) =>
            dispatch(actions.setAuthRedirectPath(path)),
    };
};

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.token !== null,
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
