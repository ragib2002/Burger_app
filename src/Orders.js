import React, { Component } from "react";
import Order from "./Order";
import axios from "./axios-orders";
import withErrorHandler from "./withErrorHandler";
import Spinner from "./Spinner";
import { connect } from "react-redux";

class Orders extends Component {
    state = {
        orders: [],
        loading: true,
    };

    componentDidMount() {
        const queryParams =
            "?auth=" +
            this.props.token +
            '&orderBy="userId"&equalTo="' +
            this.props.userId +
            '"';

        axios
            .get("/orders.json" + queryParams)
            .then((res) => {
                const fetchedOrders = [];
                for (let key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key,
                    });
                }
                this.setState({ loading: false, orders: fetchedOrders });
            })
            .catch((err) => {
                this.setState({ loading: false });
            });
    }

    render() {
        let orders = <Spinner />;
        if (!this.state.loading) {
            orders = (
                <div>
                    {this.state.orders.map((order) => (
                        <Order
                            key={order.id}
                            ingredients={order.ingredients}
                            price={order.price}
                        />
                    ))}
                </div>
            );
        }
        return orders;
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        userId: state.auth.userId,
    };
};

export default connect(mapStateToProps)(withErrorHandler(Orders, axios));
