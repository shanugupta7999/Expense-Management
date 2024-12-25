const mongoose = require("mongoose");

const transectionSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    type: {
      type: String,
      required: [true, "type is required"],
      default: "Expense", // Default value is 'Expense'
    },
    category: {
      type: String,
      required: [true, "category is required"],
      default: "Bills", // Default value is 'Bills'
    },
    reference: {
      type: String, // Reference is now optional
    },
    // description: {
    //   type: String, // Description is now optional
    // },
    date: {
      type: Date,
      required: [true, "date is required"],
      default: Date.now,
    },
  },
  { timestamps: true }
);

const transectionModel = mongoose.model("transections", transectionSchema);
module.exports = transectionModel;
