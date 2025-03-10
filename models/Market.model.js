const { Schema, model } = require("mongoose");

const DAYS_OF_WEEK = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const marketSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      /* unique: true, */
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    location: {
      type: String
    },
    schedule: [{
      days: {
        type: [String],
        enum: DAYS_OF_WEEK
      },
      hours: {
        type: String
      }
    }],
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