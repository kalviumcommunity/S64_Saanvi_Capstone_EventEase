const express = require("express");
const Vendor = require('../models/Vendor');

// Create Vendor
const createVendor = async (req, res) => {
  try {
    const { name, type, contactDetails, servicesOffered } = req.body;

    // Basic validation
    if (!name || !type || !contactDetails || !servicesOffered) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newVendor = new Vendor({
      name,
      type,
      contactDetails,
      servicesOffered
    });

    await newVendor.save();
    res.status(201).json({ message: "Vendor created", vendor: newVendor });
  } catch (err) {
    console.error("💥 Error creating vendor:", err); // <- this will help in terminal
    res.status(500).json({ message: "Server error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  getVendorById
};
