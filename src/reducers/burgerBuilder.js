import * as actionTypes from "../actionTypes";

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    orders: [],
    building: false,
    auth: {
        token: null,
        userId: null,
        error: null,
        authRedirectPath: "/",
    },
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]:
                        state.ingredients[action.ingredientName] + 1,
                },
                totalPrice:
                    state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
                building: true,
            };
        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]:
                        state.ingredients[action.ingredientName] - 1,
                },
                totalPrice:
                    state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
                building: true,
            };
        case actionTypes.SET_INGREDIENTS:
            return {
                ...state,
                ingredients: {
                    salad: action.ingredients.salad,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat,
                },
                totalPrice: 4,
                error: false,
                building: false,
            };
        case actionTypes.FETCH_INGREDIENTS_FAILED:
            return {
                ...state,
                error: true,
            };
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            const newOrder = {
                ...action.orderData,
                id: action.orderId,
            };
            return {
                ...state,
                orders: state.orders.concat(newOrder),
            };
        case actionTypes.PURCHASE_BURGER_FAIL:
            return {
                ...state,
            };
        case actionTypes.AUTH_START:
            return {
                ...state,
            };
        case actionTypes.AUTH_SUCCESS:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    token: action.token,
                    userId: action.userId,
                    error: null,
                },
            };
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    token: null,
                    userId: null,
                },
            };
        case actionTypes.SET_AUTH_REDIRECT_PATH:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    authRedirectPath: action.path,
                },
            };
        default:
            return state;
    }
};

export default reducer;
