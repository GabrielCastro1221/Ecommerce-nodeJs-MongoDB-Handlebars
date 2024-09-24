const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, required: true },
    thumbnail: { type: [String] },
    owner: { type: String, ref: "user" },
  },
  { timestamps: true, versionKey: false }
);

schema.plugin(mongoosePaginate);
module.exports = mongoose.model("Productos", schema);
