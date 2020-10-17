import React from "react";
import classes from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem";

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/">Burger Builder</NavigationItem>
        {props.isAuth ? (
            <NavigationItem link="/orders">Orders</NavigationItem>
        ) : null}
        {!props.isAuth ? (
            <NavigationItem link="/auth">Authenticate</NavigationItem>
        ) : (
            <NavigationItem link="/logout">logout</NavigationItem>
        )}
    </ul>
);

export default navigationItems;
