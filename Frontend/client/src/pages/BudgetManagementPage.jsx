import React, { useState, useEffect } from "react";
import "../Styles/BudgetManagementPage.css";

const BudgetManagementPage = () => {
  // Initial items from the image
  const initialItems = [
    {
      id: 1,
      name: "Wedding Hall",
      category: "Venue",
      vendor: "Dream Venue Hall",
      estimated: 5000,
      actual: 5200,
      status: "Paid"
    },
    {
      id: 2,
      name: "Main Course",
      category: "Catering",
      vendor: "Gourmet Delights Catering",
      estimated: 3500,
      actual: 3500,
      status: "pending"
    },
    {
      id: 3,
      name: "Ceremony Decorations",
      category: "Flowers",
      vendor: "Bloom & Petal Florists",
      estimated: 1200,
      actual: 1000,
      status: "paid"
    },
    {
      id: 4,
      name: "Full-day Coverage",
      category: "Photography",
      vendor: "Elegance Photography",
      estimated: 2300,
      actual: null,
      status: "pending"
    },
    {
      id: 5,
      name: "DJ Services",
      category: "Entertainment",
      vendor: "Sound Wave Entertainment",
      estimated: 1500,
      actual: null,
      status: "pending"
    }
  ];

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
  const [budgetItems, setBudgetItems] = useState(initialItems);
  const [activeTab, setActiveTab] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    category: "",
    name: "",
    estimated: "",
    vendor: "",
    actual: "",
    status: "pending"
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Calculate spend so far and remaining budget
  const spendSoFar = budgetItems
    .filter(item => item.actual !== null && item.actual !== "")
    .reduce((sum, item) => sum + Number(item.actual), 0);
  
  const remainingBudget = totalBudget - spendSoFar;

  // Calculate budget breakdown by category
  const calculateCategoryTotals = () => {
    const categories = ["Venue", "Catering", "Flowers", "Photography", "Entertainment"];
    return categories.map(category => {
      const categoryItems = budgetItems.filter(item => item.category === category);
      const estimated = categoryItems.reduce((sum, item) => sum + Number(item.estimated || 0), 0);
      const actual = categoryItems
        .filter(item => item.actual !== null && item.actual !== "")
        .reduce((sum, item) => sum + Number(item.actual || 0), 0);
      
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

  // Validate form
  useEffect(() => {
    if (
      newItem.category.trim() !== "" &&
      newItem.name.trim() !== "" &&
      newItem.vendor.trim() !== "" &&
      newItem.estimated.toString().trim() !== ""
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [newItem]);

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
  const handleAddItem = (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    const newBudgetItem = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      vendor: newItem.vendor,
      estimated: parseFloat(newItem.estimated),
      actual: newItem.actual ? parseFloat(newItem.actual) : null,
      status: newItem.status
    };
    
    setBudgetItems([...budgetItems, newBudgetItem]);
    
    // Reset form
    setNewItem({
      category: "",
      name: "",
      estimated: "",
      vendor: "",
      actual: "",
      status: "pending"
    });
    
    setShowAddForm(false);
  };

  // Handle status toggle
  const toggleStatus = (id) => {
    setBudgetItems(
      budgetItems.map(item => {
        if (item.id === id) {
          const newStatus = item.status.toLowerCase() === "paid" ? "pending" : "Paid";
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  // Calculate relative percentage for budget bar
  const calculatePercentage = (categoryAmount) => {
    return (categoryAmount / totalBudget) * 100;
  };

  return (
    <div className="budget-page">
      <header className="budget-header">
        <div className="logo-container">
          <img src="/eventease-logo.png" alt="EventEase" className="logo" />
          <h1>EventEase</h1>
        </div>
        <nav className="navigation">
          <a href="#">Home</a>
          <a href="#">Vendor</a>
          <a href="#">Reviews</a>
          <a href="#" className="active">Budget</a>
          <a href="#">Dashboard</a>
          <a href="#">Guests</a>
          <div className="profile-link">
            <a href="#">Profile</a>
          </div>
        </nav>
      </header>

      <main className="budget-container">
        <h1 className="page-title">Budget Tracker</h1>
        <p className="page-subtitle">Keep track of your event expenses and stay within your budget.</p>

        <div className="budget-summary">
          <div className="budget-card">
            <h3>Total Budget</h3>
            <div className="card-value-container">
              <input 
                type="number" 
                className="budget-value editable" 
                value={totalBudget}
                onChange={handleBudgetChange}
              />
              <div className="budget-icon">💰</div>
            </div>
          </div>
          
          <div className="budget-card">
            <h3>Spend so far</h3>
            <div className="card-value-container">
              <span className="budget-value">{spendSoFar.toLocaleString()}</span>
              <div className="budget-icon">💵</div>
            </div>
          </div>
          
          <div className="budget-card">
            <h3>Remaining budget</h3>
            <div className="card-value-container">
              <span className="budget-value">{remainingBudget.toLocaleString()}</span>
              <div className="budget-icon">💼</div>
            </div>
          </div>
        </div>

        <div className="budget-content">
          <div className="budget-breakdown">
            <h2>Budget Breakdown</h2>
            
            <div className="category-bars">
              {categoryTotals.map((cat) => (
                <div className="category-item" key={cat.category}>
                  <div className="category-label">{cat.category}</div>
                  <div className="category-bar-container">
                    <div 
                      className="category-bar" 
                      style={{
                        width: `${calculatePercentage(cat.estimated)}%`,
                        backgroundColor: categoryColors[cat.category]
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="breakdown-summary">
              <div className="breakdown-row">
                <div className="breakdown-label">Estimated</div>
                <div className="breakdown-value">{estimatedTotal.toLocaleString()}</div>
              </div>
              <div className="breakdown-row">
                <div className="breakdown-label">Actual</div>
                <div className="breakdown-value">{actualTotal.toLocaleString()}</div>
              </div>
              <div className="breakdown-row">
                <div className="breakdown-label">Difference</div>
                <div className="breakdown-value">{difference.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="budget-items">
            <div className="budget-items-header">
              <h2>Budget Items</h2>
              <button 
                className="add-button" 
                onClick={() => setShowAddForm(!showAddForm)}
              >
                + Add Item
              </button>
              <div className="tabs">
                <button 
                  className={activeTab === "All" ? "tab-active" : ""} 
                  onClick={() => setActiveTab("All")}
                >
                  All
                </button>
                <button 
                  className={activeTab === "Paid" ? "tab-active" : ""} 
                  onClick={() => setActiveTab("Paid")}
                >
                  Paid
                </button>
                <button 
                  className={activeTab === "pending" ? "tab-active" : ""} 
                  onClick={() => setActiveTab("pending")}
                >
                  Pending
                </button>
              </div>
            </div>

            {showAddForm && (
              <form className="add-item-form" onSubmit={handleAddItem}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={newItem.category}
                      onChange={handleInputChange}
                      placeholder="Category"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      placeholder="Item Name"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Estimated Cost</label>
                    <input
                      type="number"
                      name="estimated"
                      value={newItem.estimated}
                      onChange={handleInputChange}
                      placeholder="Estimated Cost"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Vendor</label>
                    <input
                      type="text"
                      name="vendor"
                      value={newItem.vendor}
                      onChange={handleInputChange}
                      placeholder="Vendor"
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowAddForm(false)}
                  >
                    cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={!isFormValid}
                  >
                    Add item
                  </button>
                </div>
              </form>
            )}

            <table className="budget-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Vendor</th>
                  <th>Estimated</th>
                  <th>Actual</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredItems().map((item) => (
                  <tr key={item.id} onClick={() => toggleStatus(item.id)}>
                    <td className="item-name-col">
                      <div className="item-name">{item.name}</div>
                      <div className="item-category">{item.category}</div>
                    </td>
                    <td>{item.vendor}</td>
                    <td>${item.estimated.toLocaleString()}</td>
                    <td>{item.actual ? `$${item.actual.toLocaleString()}` : "-"}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BudgetManagementPage;
