const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: String,
  message: String,
},
  { timestamps: true }
);

module.exports = mongoose.model("message", schema);