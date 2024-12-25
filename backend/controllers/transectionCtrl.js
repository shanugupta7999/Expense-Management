const transectionModel = require("../models/transectionModel");
const moment = require("moment");
const getAllTransection = async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;

    const transections = await transectionModel.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      userid: req.body.userid,
      ...(type !== "all" && { type }),
    });

    res.status(200).json(transections);
  } catch (error) {
    console.error("Error in getAllTransection:", error); // Improved debugging
    res.status(500).json({ error: error.message }); // Corrected `error` variable usage
  }
};

const getTransections = async (req, res) => {
  try {
    const { userid, type } = req.body; // Fix destructuring

    // Debugging logs to check received values
    console.log("Received userid:", userid);
    console.log("Received type:", type);

    // Build filter query
    const filter = {};

    if (userid) {
      filter.userid = userid;  // Ensure `userid` is included in the filter
    }

    if (type) {
      filter.type = type; // Filter by `type` (like 'expense')
    }

    // Debugging log to check the filter
    console.log("Filter used:", filter);

    // Query the database with the filter
    const transactions = await transectionModel.find(filter);

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ error: error.message });
  }
};


const deleteTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndDelete({ _id: req.body.transactionId });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const editTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndUpdate(
      { _id: req.body.transacationId },
      req.body.payload
    );
    res.status(200).send("Edit Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addTransection = async (req, res) => {
  try {
    // const newTransection = new transectionModel(req.body);
    const newTransection = new transectionModel(req.body);
    await newTransection.save();
    res.status(201).send("Transection Created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransection,
  addTransection,
  editTransection,
  deleteTransection,
  getTransections,
};
