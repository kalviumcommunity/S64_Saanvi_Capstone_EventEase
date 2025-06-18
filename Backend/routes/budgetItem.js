const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// Get all budget items
router.get('/', budgetController.getBudgetItems);

// Add a budget item
router.post('/', budgetController.addBudgetItem);

// Update a budget item
router.put('/:id', budgetController.updateBudgetItem);

// Delete a budget item
router.delete('/:id', budgetController.deleteBudgetItem);

module.exports = router;
