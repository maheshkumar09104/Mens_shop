const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      enum: ["T-Shirts", "Shirts", "Pants", "Shoes", "Accessories"]
    },
    image: {
      type: String,
      trim: true
    },
    stock: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        name: {
          type: String,
          required: true
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        comment: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    avgRating: {
      type: Number,
      default: 0
    },
    ratings: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
