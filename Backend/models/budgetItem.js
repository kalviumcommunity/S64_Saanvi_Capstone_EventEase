const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema({
    category: { type: String, required: true },
    itemName: { type: String, required: true },
    estimatedCost: { type: Number, required: true },
    actualCost: { type: Number, default: 0 },
    vendor: { type: String, required: true },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('BudgetItem', budgetItemSchema);
