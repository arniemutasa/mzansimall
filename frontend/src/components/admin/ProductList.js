import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";

import { getAdminProducts, clearErrors } from "../../actions/productActions";

const ProductList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAdminProducts());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    products.forEach((product) => {
      // console.log(order);
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock:
          product.stock > 0 ? (
            <p style={{ color: "green" }}>{product.stock}</p>
          ) : (
            <p style={{ color: "red" }}>{product.stock}</p>
          ),

        actions: (
          <Link to={`/admin/products/${product._id}`}>
            <i className="fa fa-pencil"></i>
          </Link>
        ),
      });
    });

    return data;
  };

  return (
    <Fragment>
      <MetaData title={"All Products"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Products</h1>

            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <MDBDataTable
                  data={setProducts()}
                  className="px-3"
                  bordered
                  striped
                  hover
                />
              </Fragment>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;
