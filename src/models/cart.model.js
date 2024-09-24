const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Productos", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

schema.pre("findOne", function (next) {
  this.populate("products.product", "_id title price");
  next();
});

module.exports = mongoose.model("carts", schema);
