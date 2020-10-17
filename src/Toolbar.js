import React from "react";
import classes from "./Toolbar.module.css";
import Logo from "./Logo";
import NavigationItems from "./NavigationItems";
import DrawerToogle from "./DrawerToggle";

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <DrawerToogle clicked={props.drawerToggleClicked} />
        <div className={classes.Logo}>
            <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuth={props.isAuth} />
        </nav>
    </header>
);

export default toolbar;
