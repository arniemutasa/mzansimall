const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Please enter shipping address"],
    },
    city: {
      type: String,
      required: [true, "Please enter City"],
    },
    phone: {
      type: String,
      required: [true, "Please enter phone"],
    },
    postalCode: {
      type: String,
      required: [true, "Please enter Postal Code"],
    },
    country: {
      type: String,
      required: [true, "Please enter Country"],
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
    },
  ],

  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
  },

  paymentDate: {
    type: Date,
  },

  subTotal: {
    type: Number,
    required: true,
    default: 0.0,
  },

  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },

  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },

  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },

  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },

  deliveredAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
