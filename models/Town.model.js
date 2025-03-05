const { Schema, model } = require("mongoose");

const townSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      /* unique: true, */
    },
    image: {
      type: String,
      /* default: ".png" */
    },
  }
);

const Town = model("Town", townSchema);

module.exports = Town;
