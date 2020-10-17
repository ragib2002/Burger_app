import React, { Component } from "react";
import Aux from "./Ax";
import Classes from "./layout.module.css";
import Toolbar from "./Toolbar";
import Sidedrawer from "./SideDrawer";
import { connect } from "react-redux";

class Layout extends Component {
    state = {
        showSideDrawer: false,
    };

    sideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false });
    };

    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        });
    };

    render() {
        return (
            <Aux>
                <Toolbar
                    drawerToggleClicked={this.sideDrawerToggleHandler}
                    isAuth={this.props.isAuth}
                />
                <Sidedrawer
                    isAuth={this.props.isAuth}
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}
                />
                <main className={Classes.Content}>{this.props.children}</main>
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.token !== null,
    };
};

export default connect(mapStateToProps)(Layout);
