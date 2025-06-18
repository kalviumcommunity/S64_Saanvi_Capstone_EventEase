import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Guest.css";
import { FaSearch, FaFileExport, FaEnvelope, FaEdit, FaTrash, FaCheck, FaClock, FaTimes } from "react-icons/fa";

const STATUS_OPTIONS = ["Confirmed", "Pending", "Declined"];
const TIME_OPTIONS = ["On time", "A little late", "Not responded"];

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    contact: "",
    status: "Pending",
    time: "Not responded",
    plusOne: 0,
  });
  const [editId, setEditId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch guests from backend
  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/guests");
      if (Array.isArray(res.data)) {
        setGuests(res.data);
      } else if (Array.isArray(res.data.guests)) {
        setGuests(res.data.guests);
      } else {
        setGuests([]);
        setError("No guests found");
      }
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError(err.response?.data?.message || "Failed to fetch guests");
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  // Add or update guest
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Validate form
      if (!form.name.trim()) {
        setError("Name is required");
        return;
      }
      if (!form.contact.trim()) {
        setError("Contact number is required");
        return;
      }

      // Prepare the data
      const guestData = {
        name: form.name.trim(),
        contact: form.contact.trim(),
        status: form.status || 'Pending',
        time: form.time || 'Not responded',
        plusOne: form.plusOne === '' || form.plusOne == null ? 0 : Number(form.plusOne)
      };

      let response;
      if (editId) {
        response = await axios.put(`/api/guests/${editId}`, guestData);
      } else {
        response = await axios.post('/api/guests', guestData);
      }

      if (response.data) {
        // Reset form and close modal
        setShowForm(false);
        setEditId(null);
        setForm({
          name: "",
          contact: "",
          status: "Pending",
          time: "Not responded",
          plusOne: 0,
        });
        
        // Refresh guest list
        await fetchGuests();
        
        // Show success message
        alert(editId ? "Guest updated successfully!" : "Guest added successfully!");
      }
    } catch (err) {
      console.error('Error saving guest:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Failed to save guest. Please try again.";
      setError(errorMessage);
      
      // Show error in alert for better visibility
      alert(`Error: ${errorMessage}`);
    }
  };

  // Delete guest
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this guest?")) return;
    setError(null);
    try {
      const res = await axios.delete(`/api/guests/${id}`);
      if (res.data) {
        await fetchGuests();
        alert("Guest deleted successfully!");
      }
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError(err.response?.data?.message || "Failed to delete guest. Please try again.");
      alert(`Error: ${err.response?.data?.message || "Failed to delete guest"}`);
    }
  };

  // Edit guest
  const handleEdit = (guest) => {
    setForm({
      name: guest.name,
      contact: guest.contact,
      status: guest.status,
      time: guest.time,
      plusOne: guest.plusOne || 0,
    });
    setEditId(guest._id);
    setShowForm(true);
  };

  // Toggle status
  const handleStatusToggle = async (guest) => {
    setError(null);
    const idx = STATUS_OPTIONS.indexOf(guest.status);
    const newStatus = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
    try {
      const res = await axios.put(`/api/guests/${guest._id}`, { status: newStatus });
      if (res.data) {
        await fetchGuests();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || "Failed to update status. Please try again.");
      alert(`Error: ${err.response?.data?.message || "Failed to update status"}`);
    }
  };

  // Toggle time
  const handleTimeToggle = async (guest) => {
    setError(null);
    const idx = TIME_OPTIONS.indexOf(guest.time);
    const newTime = TIME_OPTIONS[(idx + 1) % TIME_OPTIONS.length];
    try {
      const res = await axios.put(`/api/guests/${guest._id}`, { time: newTime });
      if (res.data) {
        await fetchGuests();
      }
    } catch (err) {
      console.error('Error updating time:', err);
      setError(err.response?.data?.message || "Failed to update time. Please try again.");
      alert(`Error: ${err.response?.data?.message || "Failed to update time"}`);
    }
  };

  // Export guests to CSV
  const handleExport = () => {
    if (guests.length === 0) {
      alert("No guests to export!");
      return;
    }

    const headers = ["Name", "Contact", "Status", "Time", "Plus One"];
    const csvData = guests.map(guest => [
      guest.name,
      guest.contact,
      guest.status,
      guest.time,
      guest.plusOne
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "guests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send invitation
  const handleSendInvitation = async (guest) => {
    setError(null);
    try {
      const res = await axios.post(`/api/guests/${guest._id}/invite`);
      if (res.data) {
        alert(`Invitation sent to ${guest.name}`);
      }
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(err.response?.data?.message || "Failed to send invitation. Please try again.");
      alert(`Error: ${err.response?.data?.message || "Failed to send invitation"}`);
    }
  };

  // Filter guests based on search query and active filter
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guest.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || guest.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalGuests = guests.length;
  const confirmed = guests.filter(g => g.status === "Confirmed").length;
  const pending = guests.filter(g => g.status === "Pending").length;
  const declined = guests.filter(g => g.status === "Declined").length;
  const totalPlusOnes = guests.reduce((sum, guest) => sum + (guest.plusOne || 0), 0);

  if (loading) {
    return <div className="loading">Loading guests...</div>;
  }

  return (
    <div className="guest-page">
      <div className="guest-header">
        <h1>Guest Management</h1>
        <div className="guest-actions">
          <button className="add-guest-btn" onClick={() => setShowForm(true)}>
            Add Guest
          </button>
          <button className="export-btn" onClick={handleExport}>
            <FaFileExport /> Export
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="guest-stats">
        <div className="stat-card">
          <h3>Total Guests</h3>
          <p>{totalGuests}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmed</h3>
          <p>{confirmed}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>
        <div className="stat-card">
          <h3>Declined</h3>
          <p>{declined}</p>
        </div>
        <div className="stat-card">
          <h3>Plus Ones</h3>
          <p>{totalPlusOnes}</p>
        </div>
      </div>

      <div className="guest-filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={activeFilter === 'All' ? 'active' : ''}
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>
          <button
            className={activeFilter === 'Confirmed' ? 'active' : ''}
            onClick={() => setActiveFilter('Confirmed')}
          >
            Confirmed
          </button>
          <button
            className={activeFilter === 'Pending' ? 'active' : ''}
            onClick={() => setActiveFilter('Pending')}
          >
            Pending
          </button>
          <button
            className={activeFilter === 'Declined' ? 'active' : ''}
            onClick={() => setActiveFilter('Declined')}
          >
            Declined
          </button>
        </div>
      </div>

      <div className="guest-list">
        {filteredGuests.length === 0 ? (
          <div className="no-guests">No guests found</div>
        ) : (
          filteredGuests.map((guest) => (
            <div key={guest._id} className="guest-card">
              <div className="guest-info">
                <h3>{guest.name}</h3>
                <p>{guest.contact}</p>
                <p>Plus One: {guest.plusOne || 0}</p>
              </div>
              <div className="guest-status">
                <button
                  className={`status-btn ${guest.status.toLowerCase()}`}
                  onClick={() => handleStatusToggle(guest)}
                >
                  {guest.status}
                </button>
                <button
                  className={`time-btn ${guest.time.toLowerCase().replace(' ', '-')}`}
                  onClick={() => handleTimeToggle(guest)}
                >
                  {guest.time}
                </button>
              </div>
              <div className="guest-actions">
                <button
                  className="invite-btn"
                  onClick={() => handleSendInvitation(guest)}
                  title="Send Invitation"
                >
                  <FaEnvelope />
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(guest)}
                  title="Edit Guest"
                >
                  <FaEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(guest._id)}
                  title="Delete Guest"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editId ? "Edit Guest" : "Add New Guest"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact:</label>
                <input
                  type="tel"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Time:</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Plus One:</label>
                <input
                  type="number"
                  min="0"
                  value={form.plusOne}
                  onChange={(e) => setForm({ ...form, plusOne: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit">{editId ? "Update" : "Add"} Guest</button>
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setForm({
                    name: "",
                    contact: "",
                    status: "Pending",
                    time: "Not responded",
                    plusOne: 0,
                  });
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
