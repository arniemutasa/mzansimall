import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";

import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);

  return (
    <Fragment>
      <h2 className="mt-5 ml-5">My Profile</h2>
      <div className="row justify-content-around mt-5 user-info">
        <div className="col-12 col-md-3">
          <figure className="avatar avatar-profile">
            <img
              className="rounded-circle img-fluid"
              src={user.avatar.url}
              alt={user.name}
            />
          </figure>
          <br />
          <Link
            to="/profile/update"
            id="edit_profile"
            className="btn btn-primary btn-block my-5"
          >
            Edit Profile
          </Link>
        </div>

        <div className="col-12 col-md-5">
          <h4>Full Name</h4>
          <p>{user.name}</p>

          <h4>Email Address</h4>
          <p>{user.email}</p>

          {user.role !== "admin" && (
            <Link to="#" className="btn btn-danger btn-block mt-5">
              My Orders
            </Link>
          )}

          <Link
            to="/password/update"
            className="btn btn-primary btn-block mt-3"
          >
            Change Password
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;
