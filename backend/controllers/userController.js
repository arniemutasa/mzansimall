const User = require("../models/User");

const ErrorHandler = require("../utils/errorHandler");
const SendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register User
// Route : /api/v1/register
// Public

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  SendToken(user, 200, res);
});

// Login User
// Route: /api/v1/login
// Public

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password are entered
  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter email and password to login", 400)
    );
  }

  // find user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Username and Password", 401));
  }

  // check if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Username and Password", 401));
  }

  SendToken(user, 200, res);
});

// Get currently logged in user
// Route /api/v1/profile
// Authenticated User
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Update Password - Requires oldPassword and new password
//Route /api/v1/password/update
// Logged In User
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 401));
  }

  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

//Update User Profile
//Route /api/v1/profile/update
// Logged In User
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserInfo = {
    name: req.body.name,
    email: req.body.email,
  };

  // update profile pic: TODO

  const user = await User.findByIdAndUpdate(req.user.id, newUserInfo, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Forgot password
// Route /api/v1/password/forgot
// Public
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get password reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset link is as follows :\n\n ${resetUrl}\n\nIf you have not requested this please ignore.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Mzansimall Password Recovery Link",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
// Route: /api/v1/password/reset/:token
// Public
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Password Reset Token is Invalid", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // set new password
  user.password = req.body.password;

  // reset token and expiry date
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Logout User
// Route: /api/v1/logout
// Public
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

//Administrator controllers

// Get All Users
// Route: /api/v1/admin/users
// Admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new ErrorHandler("No Users Found", 404));
  }

  res.status(200).json({
    success: true,
    users,
  });
});

// Get User By ID
// Route: /api/v1/admin/users/:id
// Admin
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//Update User Profile
//Route /api/v1/admin/users/:id
// Admin
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserInfo = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserInfo, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User
// Route: /api/v1/admin/users/:id
// Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  // remove avatar from hosting - TODO

  await user.remove();

  res.status(200).json({
    success: true,
  });
});
