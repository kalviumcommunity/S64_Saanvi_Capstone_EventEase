// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  name: String,
  completed: Boolean
});

module.exports = mongoose.model('Task', TaskSchema);
