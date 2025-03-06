const { Schema, model } = require("mongoose");

const townSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1706722533137-dd3c3f06c624?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  }
);

const Town = model("Town", townSchema);

module.exports = Town;
