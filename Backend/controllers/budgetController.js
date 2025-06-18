const BudgetItem = require('../models/budgetItem');

// Get all budget items
exports.getBudgetItems = async (req, res) => {
  try {
    const items = await BudgetItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error in getBudgetItems:", err.message);
    res.status(500).json({ 
      error: "Failed to fetch budget items",
      details: err.message 
    });
  }
};

// Add a budget item
exports.addBudgetItem = async (req, res) => {
  try {
    const { category, itemName, estimatedCost, actualCost, vendor, status } = req.body;

    // Validate required fields
    if (!category || !itemName || !estimatedCost || !vendor) {
      return res.status(400).json({ 
        error: "Category, item name, estimated cost, and vendor are required" 
      });
    }

    const budgetItem = new BudgetItem({ 
      category, 
      itemName, 
      estimatedCost, 
      actualCost: actualCost || 0,
      vendor, 
      status: status || 'Pending'
    });

    await budgetItem.save();
    res.status(201).json(budgetItem);
  } catch (err) {
    console.error("Error in addBudgetItem:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        error: "Validation Error", 
        details: errors 
      });
    }

    res.status(400).json({ 
      error: "Failed to add budget item",
      details: err.message 
    });
  }
};

// Update a budget item
exports.updateBudgetItem = async (req, res) => {
  try {
    const { category, itemName, estimatedCost, actualCost, vendor, status } = req.body;
    const updateData = {};

    // Only update fields that are provided
    if (category) updateData.category = category;
    if (itemName) updateData.itemName = itemName;
    if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost;
    if (actualCost !== undefined) updateData.actualCost = actualCost;
    if (vendor) updateData.vendor = vendor;
    if (status) updateData.status = status;

    const budgetItem = await BudgetItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!budgetItem) {
      return res.status(404).json({ error: 'Budget item not found' });
    }

    res.json(budgetItem);
  } catch (err) {
    console.error("Error in updateBudgetItem:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        error: "Validation Error", 
        details: errors 
      });
    }

    res.status(400).json({ 
      error: "Failed to update budget item",
      details: err.message 
    });
  }
};

// Delete a budget item
exports.deleteBudgetItem = async (req, res) => {
  try {
    const budgetItem = await BudgetItem.findByIdAndDelete(req.params.id);
    if (!budgetItem) {
      return res.status(404).json({ error: 'Budget item not found' });
    }
    res.json({ 
      message: 'Budget item deleted successfully',
      deletedItem: budgetItem 
    });
  } catch (err) {
    console.error("Error in deleteBudgetItem:", err);
    res.status(400).json({ 
      error: "Failed to delete budget item",
      details: err.message 
    });
  }
}; 