import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/BudgetManagementPage.css";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";

const BudgetManagementPage = () => {
  // Category colors
  const categoryColors = {
    "Venue": "#6BAAA0",
    "Catering": "#BE72C3",
    "Flowers": "#66BB6A",
    "Photography": "#E57373",
    "Entertainment": "#7986CB"
  };

  // State variables
  const [totalBudget, setTotalBudget] = useState(15000);
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    category: "",
    itemName: "",
    estimatedCost: "",
    vendor: "",
    actualCost: "",
    status: "Pending"
  });

  // Fetch budget items from backend
  useEffect(() => {
    fetchBudgetItems();
  }, []);

  const fetchBudgetItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/budget");
      setBudgetItems(response.data);
    } catch (err) {
      console.error('Error fetching budget items:', err);
      setError(err.response?.data?.error || "Failed to fetch budget items");
      // Fallback to dummy data if backend fails
      setBudgetItems([
        {
          _id: 1,
          itemName: "Wedding Hall",
          category: "Venue",
          vendor: "Dream Venue Hall",
          estimatedCost: 5000,
          actualCost: 5200,
          status: "Paid"
        },
        {
          _id: 2,
          itemName: "Main Course",
          category: "Catering",
          vendor: "Gourmet Delights Catering",
          estimatedCost: 3500,
          actualCost: 3500,
          status: "Pending"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate spend so far and remaining budget
  const spendSoFar = budgetItems
    .filter(item => item.actualCost && item.actualCost > 0)
    .reduce((sum, item) => sum + Number(item.actualCost), 0);
  
  const remainingBudget = totalBudget - spendSoFar;

  // Calculate budget breakdown by category
  const calculateCategoryTotals = () => {
    const categories = ["Venue", "Catering", "Flowers", "Photography", "Entertainment"];
    return categories.map(category => {
      const categoryItems = budgetItems.filter(item => item.category === category);
      const estimated = categoryItems.reduce((sum, item) => sum + Number(item.estimatedCost || 0), 0);
      const actual = categoryItems
        .filter(item => item.actualCost && item.actualCost > 0)
        .reduce((sum, item) => sum + Number(item.actualCost || 0), 0);
      
      return { category, estimated, actual };
    });
  };

  const categoryTotals = calculateCategoryTotals();
  
  // Calculate totals for the breakdown section
  const estimatedTotal = categoryTotals.reduce((sum, cat) => sum + cat.estimated, 0);
  const actualTotal = categoryTotals.reduce((sum, cat) => sum + cat.actual, 0);
  const difference = estimatedTotal - actualTotal;

  // Filter items based on active tab
  const getFilteredItems = () => {
    if (activeTab === "All") return budgetItems;
    return budgetItems.filter(item => 
      item.status.toLowerCase() === activeTab.toLowerCase()
    );
  };

  // Handle budget change
  const handleBudgetChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTotalBudget(value);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newItem.category || !newItem.itemName || !newItem.estimatedCost || !newItem.vendor) {
      setError("Please fill in all required fields");
      return;
    }
    
    setError(null);
    try {
      const budgetData = {
        category: newItem.category,
        itemName: newItem.itemName,
        estimatedCost: parseFloat(newItem.estimatedCost),
        actualCost: newItem.actualCost ? parseFloat(newItem.actualCost) : 0,
        vendor: newItem.vendor,
        status: newItem.status
      };

      const response = await axios.post('/api/budget', budgetData);
      setBudgetItems([response.data, ...budgetItems]);
      
      // Reset form
      setNewItem({
        category: "",
        itemName: "",
        estimatedCost: "",
        vendor: "",
        actualCost: "",
        status: "Pending"
      });
      
      setShowAddForm(false);
      alert("Budget item added successfully!");
    } catch (err) {
      console.error('Error adding budget item:', err);
      setError(err.response?.data?.error || "Failed to add budget item");
      alert(`Error: ${err.response?.data?.error || "Failed to add budget item"}`);
    }
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      category: item.category,
      itemName: item.itemName,
      estimatedCost: item.estimatedCost.toString(),
      vendor: item.vendor,
      actualCost: item.actualCost ? item.actualCost.toString() : "",
      status: item.status
    });
    setShowAddForm(true);
  };

  // Handle update item
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    
    if (!editingItem) return;
    
    // Validate form
    if (!newItem.category || !newItem.itemName || !newItem.estimatedCost || !newItem.vendor) {
      setError("Please fill in all required fields");
      return;
    }
    
    setError(null);
    try {
      const budgetData = {
        category: newItem.category,
        itemName: newItem.itemName,
        estimatedCost: parseFloat(newItem.estimatedCost),
        actualCost: newItem.actualCost ? parseFloat(newItem.actualCost) : 0,
        vendor: newItem.vendor,
        status: newItem.status
      };

      const response = await axios.put(`/api/budget/${editingItem._id}`, budgetData);
      
      setBudgetItems(budgetItems.map(item => 
        item._id === editingItem._id ? response.data : item
      ));
      
      // Reset form
      setNewItem({
        category: "",
        itemName: "",
        estimatedCost: "",
        vendor: "",
        actualCost: "",
        status: "Pending"
      });
      
      setEditingItem(null);
      setShowAddForm(false);
      alert("Budget item updated successfully!");
    } catch (err) {
      console.error('Error updating budget item:', err);
      setError(err.response?.data?.error || "Failed to update budget item");
      alert(`Error: ${err.response?.data?.error || "Failed to update budget item"}`);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget item?")) return;
    
    setError(null);
    try {
      await axios.delete(`/api/budget/${id}`);
      setBudgetItems(budgetItems.filter(item => item._id !== id));
      alert("Budget item deleted successfully!");
    } catch (err) {
      console.error('Error deleting budget item:', err);
      setError(err.response?.data?.error || "Failed to delete budget item");
      alert(`Error: ${err.response?.data?.error || "Failed to delete budget item"}`);
    }
  };

  // Handle status toggle
  const toggleStatus = async (item) => {
    setError(null);
    try {
      const newStatus = item.status.toLowerCase() === "paid" ? "Pending" : "Paid";
      const response = await axios.put(`/api/budget/${item._id}`, { status: newStatus });
      
      setBudgetItems(budgetItems.map(budgetItem => 
        budgetItem._id === item._id ? response.data : budgetItem
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.error || "Failed to update status");
      alert(`Error: ${err.response?.data?.error || "Failed to update status"}`);
    }
  };

  // Calculate relative percentage for budget bar
  const calculatePercentage = (categoryAmount) => {
    return (categoryAmount / totalBudget) * 100;
  };

  // Cancel edit/add form
  const cancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setNewItem({
      category: "",
      itemName: "",
      estimatedCost: "",
      vendor: "",
      actualCost: "",
      status: "Pending"
    });
    setError(null);
  };

  return (
    <div className="budget-page">
      <main className="budget-container">
        <h1 className="page-title">Budget Tracker</h1>
        <p className="page-subtitle">Keep track of your event expenses and stay within your budget.</p>

        <div className="budget-summary">
          <div className="budget-overview">
            <div className="budget-card">
              <h3>Total Budget</h3>
              <div className="budget-input-container">
                <span>$</span>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={handleBudgetChange}
                  className="budget-input"
                />
              </div>
            </div>
            <div className="budget-card">
              <h3>Spent So Far</h3>
              <p className="spent-amount">${spendSoFar.toLocaleString()}</p>
            </div>
            <div className="budget-card">
              <h3>Remaining</h3>
              <p className={`remaining-amount ${remainingBudget < 0 ? 'over-budget' : ''}`}>
                ${remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="budget-breakdown">
          <h2>Budget Breakdown</h2>
          <div className="breakdown-grid">
            {categoryTotals.map((category) => (
              <div key={category.category} className="breakdown-card">
                <div className="breakdown-header">
                  <h3>{category.category}</h3>
                  <div 
                    className="category-color" 
                    style={{ backgroundColor: categoryColors[category.category] || '#999' }}
                  ></div>
                </div>
                <div className="breakdown-bars">
                  <div className="bar-container">
                    <div className="bar-label">Estimated</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill estimated"
                        style={{ width: `${calculatePercentage(category.estimated)}%` }}
                      ></div>
                    </div>
                    <span className="bar-amount">${category.estimated.toLocaleString()}</span>
                  </div>
                  <div className="bar-container">
                    <div className="bar-label">Actual</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill actual"
                        style={{ width: `${calculatePercentage(category.actual)}%` }}
                      ></div>
                    </div>
                    <span className="bar-amount">${category.actual.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="budget-items-section">
          <div className="section-header">
            <h2>Budget Items</h2>
            <button 
              className="add-item-btn"
              onClick={() => setShowAddForm(true)}
            >
              <FaPlus /> Add Item
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
              onClick={() => setActiveTab("All")}
            >
              All ({budgetItems.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === "Paid" ? "active" : ""}`}
              onClick={() => setActiveTab("Paid")}
            >
              Paid ({budgetItems.filter(item => item.status === "Paid").length})
            </button>
            <button 
              className={`tab-btn ${activeTab === "Pending" ? "active" : ""}`}
              onClick={() => setActiveTab("Pending")}
            >
              Pending ({budgetItems.filter(item => item.status === "Pending").length})
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading budget items...</div>
          ) : (
            <div className="budget-items-grid">
              {getFilteredItems().map((item) => (
                <div key={item._id} className="budget-item-card">
                  <div className="item-header">
                    <div className="item-category">
                      <div 
                        className="category-indicator"
                        style={{ backgroundColor: categoryColors[item.category] || '#999' }}
                      ></div>
                      <span>{item.category}</span>
                    </div>
                    <div className="item-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditItem(item)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteItem(item._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="item-name">{item.itemName}</h3>
                  <p className="item-vendor">{item.vendor}</p>
                  
                  <div className="item-costs">
                    <div className="cost-row">
                      <span>Estimated:</span>
                      <span className="estimated-cost">${item.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="cost-row">
                      <span>Actual:</span>
                      <span className="actual-cost">
                        {item.actualCost ? `$${item.actualCost.toLocaleString()}` : "Not set"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="item-status">
                    <button 
                      className={`status-btn ${item.status.toLowerCase()}`}
                      onClick={() => toggleStatus(item)}
                    >
                      {item.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {getFilteredItems().length === 0 && !loading && (
            <div className="no-items">
              <p>No budget items found. Add your first item to get started!</p>
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingItem ? "Edit Budget Item" : "Add Budget Item"}</h2>
                <button className="close-btn" onClick={cancelForm}>
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
                <div className="form-group">
                  <label>Category *</label>
                  <select 
                    name="category" 
                    value={newItem.category} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Flowers">Flowers</option>
                    <option value="Photography">Photography</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    name="itemName"
                    value={newItem.itemName}
                    onChange={handleInputChange}
                    placeholder="e.g., Wedding Hall, Main Course"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Vendor *</label>
                  <input
                    type="text"
                    name="vendor"
                    value={newItem.vendor}
                    onChange={handleInputChange}
                    placeholder="e.g., Dream Venue Hall"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Estimated Cost *</label>
                    <input
                      type="number"
                      name="estimatedCost"
                      value={newItem.estimatedCost}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Actual Cost</label>
                    <input
                      type="number"
                      name="actualCost"
                      value={newItem.actualCost}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    name="status" 
                    value={newItem.status} 
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={cancelForm}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingItem ? <><FaSave /> Update</> : <><FaPlus /> Add</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BudgetManagementPage;
