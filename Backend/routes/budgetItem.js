const express = require('express');
const router = express.Router();
const BudgetItem = require('../models/budgetItem');

// Get all items
router.get('/', async (req, res) => {
  const items = await BudgetItem.find();
  res.json(items);
});

// Add item
router.post('/', async (req, res) => {
  const item = new BudgetItem(req.body);
  await item.save();
  res.json(item);
});

// Update item
router.put('/:id', async (req, res) => {
  const updatedItem = await BudgetItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

// Delete item
router.delete('/:id', async (req, res) => {
  await BudgetItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

module.exports = router;
