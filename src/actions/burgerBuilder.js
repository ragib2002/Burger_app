import * as actionTypes from "../actionTypes";
import axios from "../axios-orders";

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name,
    };
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name,
    };
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients,
    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED,
    };
};

export const initIngredients = () => {
    console.log("hello");
    console.log("sfdkj");
    return (dispath) => {
        console.log("hello");
        axios
            .get(
                "https://react-my-burgur-3f281.firebaseio.com/ingredients.json"
            )
            .then((response) => {
                console.log("hello");
                dispath(setIngredients(response.data));
            })
            .catch((error) => {
                dispath(fetchIngredientsFailed());
            });
    };
};
