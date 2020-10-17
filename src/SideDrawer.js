import React from "react";
import Logo from "./Logo";
import NavigationItems from "./NavigationItems";
import classes from "./SideDrawer.module.css";
import Backdrop from "./Backdrop";
import Aux from "./Ax";

const sideDrawer = (props) => {
    let attachClasses = [classes.SideDrawer, classes.Closed];
    if (props.open) {
        attachClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.closed} />
            <div className={attachClasses.join(" ")} onClick={props.closed}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems isAuth={props.isAuth} />
                </nav>
            </div>
        </Aux>
    );
};

export default sideDrawer;
