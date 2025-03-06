const { Schema, model } = require("mongoose");

const marketSchema = new Schema(
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
    location: {
        type: String
    },
    timetable: {
        type: String
    },
    description: {
      type: String
    },
    town: {
        type: Schema.Types.ObjectId,
        ref: 'Town',
        required: true
    }
  }
);

const Market = model("Market", marketSchema);

module.exports = Market;