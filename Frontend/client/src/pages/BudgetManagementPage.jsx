import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/BudgetManagementPage.css";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";

const breakdownColors = ['#42a5f5','#ec407a','#66bb6a','#ffa726','#7c4dff'];

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

  // Add state for editing total budget
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(totalBudget);

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

  // Handler for budget input blur or Enter
  const handleBudgetInputBlur = () => {
    setEditingBudget(false);
    if (budgetInput !== totalBudget) {
      setTotalBudget(Number(budgetInput));
    }
  };
  const handleBudgetInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBudgetInputBlur();
    }
  };

  // Add the handler for updating actual cost
  const handleUpdateActualCost = async (updatedItem) => {
    try {
      const budgetData = {
        ...updatedItem,
        estimatedCost: parseFloat(updatedItem.estimatedCost),
        actualCost: updatedItem.actualCost ? parseFloat(updatedItem.actualCost) : 0,
      };
      const response = await axios.put(`/api/budget/${updatedItem._id}`, budgetData);
      setBudgetItems(budgetItems.map(item =>
        item._id === updatedItem._id ? response.data : item
      ));
    } catch (err) {
      alert('Failed to update actual cost');
    }
  };

  return (
    <div className="budget-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf6e3 0%, #e0c3fc 100%)', paddingBottom: 40 }}>
      <main className="budget-container" style={{ boxShadow: '0 8px 32px rgba(124,77,255,0.10)', borderRadius: 24, marginTop: 32, background: 'rgba(255,255,255,0.95)' }}>
        <h1 className="page-title" style={{ fontFamily: 'Luckiest Guy, cursive', fontSize: '2.7rem', color: '#7c4dff', textShadow: '2px 2px 0 #f7b5e6' }}>Budget Tracker</h1>
        <p className="page-subtitle" style={{ color: '#7c4dff', fontWeight: 600, fontSize: '1.15rem', textShadow: '1px 1px 0 #fffbe6' }}>Keep track of your event expenses and stay within your budget.</p>

        <div style={{ display: "flex", gap: "24px", justifyContent: "center", margin: "32px 0" }}>
          <div className="budget-card" style={{ background: 'linear-gradient(135deg, #fffbe6 60%, #ffe0b2 100%)', border: '2px solid #ffd54f', boxShadow: '0 4px 16px #ffe08255', borderRadius: 18 }}>
            <h3 style={{ color: '#b26a00', fontWeight: 700, fontFamily: 'Luckiest Guy, cursive' }}>Total Budget</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.5rem", cursor: 'pointer' }} onClick={() => setEditingBudget(true)}>
              {editingBudget ? (
                <input
                  type="number"
                  value={budgetInput}
                  autoFocus
                  onChange={e => setBudgetInput(e.target.value)}
                  onBlur={handleBudgetInputBlur}
                  onKeyDown={handleBudgetInputKeyDown}
                  style={{ fontSize: '1.5rem', fontWeight: 'bold', width: 100, borderRadius: 8, border: '2px solid #ffd54f', boxShadow: '0 0 8px #ffe082', padding: '2px 8px', outline: 'none' }}
                />
              ) : (
                <span style={{ marginRight: 8 }}>₹{totalBudget.toLocaleString()}</span>
              )}
              <span role="img" aria-label="budget">💰</span>
            </div>
          </div>
          <div className="budget-card" style={{ background: 'linear-gradient(135deg, #fffbe6 60%, #b2ebf2 100%)', border: '2px solid #4dd0e1', boxShadow: '0 4px 16px #4dd0e155', borderRadius: 18 }}>
            <h3 style={{ color: '#00838f', fontWeight: 700, fontFamily: 'Luckiest Guy, cursive' }}>Spend so far</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
              <span style={{ marginRight: 8 }}>₹{spendSoFar.toLocaleString()}</span>
              <span role="img" aria-label="spent">⚙️</span>
            </div>
          </div>
          <div className="budget-card" style={{ background: 'linear-gradient(135deg, #fffbe6 60%, #c5e1a5 100%)', border: '2px solid #81c784', boxShadow: '0 4px 16px #aed58155', borderRadius: 18 }}>
            <h3 style={{ color: '#33691e', fontWeight: 700, fontFamily: 'Luckiest Guy, cursive' }}>Remaining budget</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
              <span style={{ marginRight: 8 }}>₹{remainingBudget.toLocaleString()}</span>
              <span role="img" aria-label="remaining"></span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "40px", justifyContent: "center", alignItems: "flex-start" }}>
          <div className="budget-breakdown" style={{ minWidth: 320, background: "#fdf6e3", borderRadius: 18, padding: 24, boxShadow: '0 2px 12px #b39ddb33', border: '2px solid #b39ddb' }}>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 24, color: '#7c4dff', fontFamily: 'Luckiest Guy, cursive' }}>Budget Breakdown</h2>
            {categoryTotals.map((cat, idx) => (
              <div key={cat.category} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 700, color: breakdownColors[idx], fontSize: 18 }}>{cat.category}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="range" min="0" max={totalBudget} value={cat.estimated} disabled style={{ accentColor: breakdownColors[idx], width: 140, background: 'transparent' }} />
                  <span style={{ fontSize: 14, color: '#888' }}>Estimated</span>
                  <span style={{ fontWeight: 600, marginLeft: 8, color: '#222' }}>{cat.estimated.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <input type="range" min="0" max={totalBudget} value={cat.actual} disabled style={{ accentColor: breakdownColors[idx], width: 140, opacity: 0.7, background: 'transparent' }} />
                  <span style={{ fontSize: 14, color: '#888' }}>Actual</span>
                  <span style={{ fontWeight: 600, marginLeft: 8, color: '#222' }}>{cat.actual.toLocaleString()}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 32, fontWeight: 600, color: '#7c4dff' }}>
              <div>Estimated <span style={{ float: "right" }}>₹{estimatedTotal.toLocaleString()}</span></div>
              <div>Actual <span style={{ float: "right" }}>₹{actualTotal.toLocaleString()}</span></div>
              <div>Difference <span style={{ float: "right" }}>₹{difference.toLocaleString()}</span></div>
            </div>
        </div>

          <div className="budget-items" style={{ flex: 1, background: "#fdf6e3", borderRadius: 18, padding: 24, boxShadow: '0 2px 12px #ffd54f33', border: '2px solid #ffd54f' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.3rem", color: '#b26a00', fontFamily: 'Luckiest Guy, cursive', letterSpacing: 1 }}>Budget Items</h2>
              <button className="add-item-btn" style={{ background: "linear-gradient(90deg,#f7b5e6,#ffd54f)", borderRadius: 16, padding: "10px 22px", fontWeight: 700, fontSize: "1.1rem", color: '#7c4dff', boxShadow: '0 2px 8px #ffd54f55', border: 'none', transition: 'box-shadow 0.2s' }} onMouseOver={e => e.currentTarget.style.boxShadow='0 4px 16px #ffd54f99'} onMouseOut={e => e.currentTarget.style.boxShadow='0 2px 8px #ffd54f55'} onClick={() => setShowAddForm(true)}>
                <FaPlus style={{ marginRight: 6 }} /> Add Item
            </button>
          </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 18, marginBottom: 12 }}>
              <span style={{ background: '#ffe0b2', color: '#b26a00', borderRadius: 12, padding: '6px 16px', fontWeight: 700, fontSize: '1.05rem', boxShadow: '0 2px 8px #ffd54f33' }}>
                Pending: {budgetItems.filter(item => item.status.toLowerCase() === 'pending').length}
              </span>
              <span style={{ background: '#c8e6c9', color: '#256029', borderRadius: 12, padding: '6px 16px', fontWeight: 700, fontSize: '1.05rem', boxShadow: '0 2px 8px #66bb6a33' }}>
                Paid: {budgetItems.filter(item => item.status.toLowerCase() === 'paid').length}
              </span>
            </div>
            <div style={{ display: "flex", gap: 18, marginBottom: 18 }}>
              <button className={`tab-btn ${activeTab === "All" ? "active" : ""}`} style={{ background: '#f7b5e6', color: '#7c4dff', borderRadius: 12, fontWeight: 700, border: 'none', padding: '8px 18px', boxShadow: '0 2px 8px #f7b5e655', transition: 'box-shadow 0.2s' }} onClick={() => setActiveTab("All")}>All</button>
              <button className={`tab-btn ${activeTab === "Paid" ? "active" : ""}`} style={{ background: '#c8e6c9', color: '#256029', borderRadius: 12, fontWeight: 700, border: 'none', padding: '8px 18px', boxShadow: '0 2px 8px #66bb6a55', transition: 'box-shadow 0.2s' }} onClick={() => setActiveTab("Paid")}>Paid</button>
              <button className={`tab-btn ${activeTab === "Pending" ? "active" : ""}`} style={{ background: '#ffe0b2', color: '#b26a00', borderRadius: 12, fontWeight: 700, border: 'none', padding: '8px 18px', boxShadow: '0 2px 8px #ffd54f55', transition: 'box-shadow 0.2s' }} onClick={() => setActiveTab("Pending")}>Pending</button>
          </div>
            <table style={{ width: "100%", background: "#f7e3c6", borderCollapse: "separate", borderSpacing: 0, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px #ffd54f33' }}>
              <thead style={{ background: "linear-gradient(90deg,#f7b5e6,#ffd54f)", color: '#7c4dff' }}>
                <tr>
                  <th style={{ textAlign: "left", padding: '12px 8px', color: '#a67c00', fontWeight: 700 }}>Item</th>
                  <th style={{ textAlign: "left", padding: '12px 8px', color: '#a67c00', fontWeight: 700 }}>Vendor</th>
                  <th style={{ textAlign: "left", padding: '12px 8px', color: '#a67c00', fontWeight: 700 }}>Estimated</th>
                  <th style={{ textAlign: "left", padding: '12px 8px', color: '#a67c00', fontWeight: 700 }}>Actual</th>
                  <th style={{ textAlign: "left", padding: '12px 8px', color: '#a67c00', fontWeight: 700 }}>Status</th>
                  <th style={{ textAlign: "left", padding: '12px 8px', color: '#a67c00', fontWeight: 700 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredItems().map(item => (
                  <tr key={item._id} style={{
                    background: item.status.toLowerCase() === 'paid' ? '#e8f5e9'
                      : item.status.toLowerCase() === 'pending' ? '#fff8e1'
                      : '#fff',
                    borderBottom: '1px solid #e3b08a',
                    transition: 'background 0.2s',
                    cursor: 'pointer'
                  }}
                    onMouseOver={e => e.currentTarget.style.background='#ffe0b2'}
                    onMouseOut={e => e.currentTarget.style.background=(item.status.toLowerCase() === 'paid' ? '#e8f5e9' : item.status.toLowerCase() === 'pending' ? '#fff8e1' : '#fff')}
                  >
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{ fontWeight: "bold", color: '#7c4dff' }}>{item.itemName}</span>
                      <br />
                      <span style={{ fontSize: "0.95em", color: "#a67c00" }}>{item.category}</span>
                    </td>
                    <td style={{ padding: '10px 8px', color: '#00838f', fontWeight: 600 }}>{item.vendor}</td>
                    <td style={{ padding: '10px 8px', color: '#b26a00', fontWeight: 600 }}>₹{item.estimatedCost.toLocaleString()}</td>
                    <td style={{ padding: '10px 8px', color: '#33691e', fontWeight: 600 }}>
                      <input
                        type="number"
                        value={item.actualCost || ''}
                        min="0"
                        style={{ width: 90, borderRadius: 8, border: '1px solid #ffd54f', padding: '2px 8px', fontWeight: 600, color: '#33691e', background: '#fff' }}
                        onChange={e => {
                          const newValue = e.target.value;
                          // Call update logic for actualCost only
                          const updatedItem = { ...item, actualCost: newValue };
                          handleUpdateActualCost(updatedItem);
                        }}
                      />
                    </td>
                    <td style={{ padding: '10px 8px', cursor: 'pointer' }} onClick={() => toggleStatus(item)}>
                      <span style={{
                        display: 'inline-block',
                        background: item.status.toLowerCase() === 'paid' ? 'linear-gradient(90deg,#c8e6c9,#81c784)' : 'linear-gradient(90deg,#ffe0b2,#ffd54f)',
                        color: item.status.toLowerCase() === 'paid' ? '#256029' : '#b26a00',
                        borderRadius: 12,
                        padding: '6px 16px',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        textTransform: 'capitalize',
                        userSelect: 'none',
                        boxShadow: '0 2px 8px #ffd54f55',
                        border: item.status.toLowerCase() === 'paid' ? '2px solid #81c784' : '2px solid #ffd54f',
                        transition: 'box-shadow 0.2s, border 0.2s',
                        backgroundClip: 'padding-box',
                        WebkitBackgroundClip: 'padding-box',
                        filter: 'drop-shadow(0 2px 8px #ffd54f33)'
                      }}>{item.status}</span>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <button 
                        style={{ background: '#f7b5e6', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#7c4dff', fontWeight: 700, cursor: 'pointer', marginRight: 8 }}
                        onClick={e => { e.stopPropagation(); handleEditItem(item); }}
                      >
                      Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                    <h2 style={{ color: '#7c4dff', fontFamily: 'Luckiest Guy, cursive' }}>{editingItem ? "Edit Budget Item" : "Add Budget Item"}</h2>
                    <button className="close-btn" onClick={cancelForm}>×</button>
              </div>
                  <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                      <select name="category" value={newItem.category} onChange={handleInputChange} required style={{ borderRadius: 16, background: "#f7b5e6", border: "2px solid #ffd54f", padding: "12px", width: "100%", fontWeight: 600, color: '#7c4dff' }}>
                    <option value="">Select Category</option>
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Flowers">Flowers</option>
                    <option value="Photography">Photography</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                      <input name="itemName" value={newItem.itemName} onChange={handleInputChange} placeholder="Item Name" required style={{ borderRadius: 16, background: "#f7b5e6", border: "2px solid #ffd54f", padding: "12px", width: "100%", fontWeight: 600, color: '#7c4dff' }} />
                </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                      <input name="estimatedCost" value={newItem.estimatedCost} onChange={handleInputChange} placeholder="Estimated Cost" required style={{ borderRadius: 16, background: "#ffe0b2", border: "2px solid #ffd54f", padding: "12px", width: "100%", fontWeight: 600, color: '#b26a00' }} />
                      <input name="vendor" value={newItem.vendor} onChange={handleInputChange} placeholder="Vendor" required style={{ borderRadius: 16, background: "#b2ebf2", border: "2px solid #4dd0e1", padding: "12px", width: "100%", fontWeight: 600, color: '#00838f' }} />
                </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                      <button type="button" onClick={cancelForm} style={{ background: "#f7b5e6", borderRadius: 16, padding: "10px 22px", fontWeight: 700, fontSize: "1.1rem", border: "none", color: '#7c4dff', boxShadow: '0 2px 8px #f7b5e655' }}>cancel</button>
                      <button type="submit" style={{ background: "#ffd54f", borderRadius: 16, padding: "10px 22px", fontWeight: 700, fontSize: "1.1rem", border: "none", color: '#b26a00', boxShadow: '0 2px 8px #ffd54f55' }}>Add item</button>
                </div>
              </form>
            </div>
          </div>
        )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BudgetManagementPage;
