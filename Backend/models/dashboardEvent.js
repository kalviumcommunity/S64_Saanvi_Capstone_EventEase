const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: String,
  completed: { type: Boolean, default: false }
});

const EventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  date: Date,
  type: String,
  description: String,
  tasks: [TaskSchema]
});

module.exports = mongoose.model("Event", EventSchema);
