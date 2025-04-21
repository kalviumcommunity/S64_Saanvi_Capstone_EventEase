const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  contactDetails: {
    type: String,
    required: true,
  },
  servicesOffered: { // <- previously you probably had 'serviceType' here
    type: [String],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Vendor", vendorSchema);
