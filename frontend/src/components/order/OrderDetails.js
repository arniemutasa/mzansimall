import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";

import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";

import { getOrderDetails, clearErrors } from "../../actions/orderActions";

const OrderDetails = ({ match }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, order } = useSelector((state) => state.orderDetails);

  const { user } = useSelector((state) => state.auth);

  const { shippingInfo, orderItems, paymentInfo, totalPrice, orderStatus } =
    order;

  useEffect(() => {
    dispatch(getOrderDetails(match.params.id));

    if (error) {
      error.alert(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, match.params.id]);

  return (
    <Fragment>
      <MetaData title={"Order Details"} />
      {loading ? (
        <Fragment></Fragment>
      ) : (
        <Fragment>
          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-details">
              <h1 className="my-5">Order {order._id}</h1>

              <h4 className="mb-4">Shipping Info</h4>
              <p>
                <b>Name:</b> {user.name}
              </p>
              <p>
                <b>Phone:</b> 111 111 1111
              </p>
              <p className="mb-4">
                <b>Address:</b>
                {shippingInfo.address}, {shippingInfo.city},{" "}
                {shippingInfo.country}
              </p>
              <p>
                <b>Amount:</b> ${totalPrice}
              </p>

              <hr />

              <h4 className="my-4">Payment</h4>
              <p className="greenColor">
                <b>{paymentInfo.status}</b>
              </p>

              <h4 className="my-4">Order Status:</h4>
              <p className="greenColor">
                <b>{orderStatus}</b>
              </p>

              <h4 className="my-4">Order Items:</h4>
              <hr />
              {orderItems &&
                orderItems.map((item) => (
                  <Fragment>
                    <div key={item.product} className="cart-item my-1">
                      <div className="row my-5">
                        <div className="col-4 col-lg-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            height="45"
                            width="65"
                          />
                        </div>

                        <div className="col-5 col-lg-5">
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                          <p>${item.price}</p>
                        </div>

                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                          <p>{item.quantity} Piece(s)</p>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </Fragment>
                ))}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
