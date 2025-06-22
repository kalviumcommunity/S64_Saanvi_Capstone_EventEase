import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Guest.css";
import { FaSearch, FaFileExport, FaEnvelope, FaEdit, FaTrash, FaCheck, FaClock, FaTimes, FaPlus } from "react-icons/fa";

const STATUS_OPTIONS = ["Confirmed", "Pending", "Declined"];
const TIME_OPTIONS = ["On time", "A little late", "Not responded"];

function getAvatarColor(name) {
  // Simple hash for color
  const colors = ["#f9b4ab", "#f7d08a", "#b4e7d9", "#b5b9f7", "#f7b5e6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

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
  const [activeFilter, setActiveFilter] = useState("All");

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
    <div className="guest-page" style={{ background: "#fffbe6", minHeight: "100vh", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "#fffbe6", padding: "24px 24px 0 24px" }}>
        <h1 style={{ fontFamily: "'Luckiest Guy', cursive, sans-serif", fontSize: "2.5rem", margin: 0, letterSpacing: 1, background: "none", color: "#222" }}>GUEST MANAGEMENT</h1>
        <div style={{ fontSize: "1.1rem", color: "#444", margin: "8px 0 18px 0" }}>
          Keep track of your event attendees, send invitations, and manage RSVPs all in one place
        </div>
        {/* Action Bar */}
        <div style={{ display: "flex", gap: 16, marginBottom: 18, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#f7e3c6", borderRadius: 18, padding: "8px 18px" }}>
            <FaSearch style={{ marginRight: 8, color: "#b76a4a" }} />
          <input
            type="text"
              placeholder="Search guest"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", fontSize: "1rem", flex: 1 }}
          />
        </div>
          <button className="guest-btn" style={{ background: "#f7e3c6", color: "#b76a4a", fontWeight: 600 }} onClick={handleExport}>
            <FaFileExport style={{ marginRight: 6 }} /> Export
          </button>
          <button className="guest-btn" style={{ background: "#f7e3c6", color: "#b76a4a", fontWeight: 600 }} disabled>
            Send Invitation <span style={{ fontSize: 12, marginLeft: 2 }}>▼</span>
          </button>
          <button className="guest-btn add" style={{ background: "#f7b5e6", color: "#222", fontWeight: 700 }} onClick={() => setShowForm(true)}>
            <FaPlus style={{ marginRight: 6 }} /> Add Guest
          </button>
        </div>
      </div>

      {/* Guest Table */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", margin: "0 24px", padding: 0, overflow: "hidden", border: "1px solid #e3e3e3" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: "1rem" }}>
          <thead style={{ background: "#f7e3c6" }}>
            <tr>
              <th style={{ padding: "12px 8px" }}><input type="checkbox" disabled /></th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Guest</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Contact</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Time</th>
              <th style={{ padding: "12px 8px", textAlign: "left" }}>Plus One</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
        {filteredGuests.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: "#b76a4a" }}>No guests found</td></tr>
            ) : (
              filteredGuests.map((guest, idx) => (
                <tr key={guest._id || idx} style={{ borderBottom: "1px solid #f7e3c6" }}>
                  <td style={{ textAlign: "center" }}><input type="checkbox" disabled /></td>
                  <td style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 8px" }}>
                    <span style={{ width: 36, height: 36, borderRadius: "50%", background: getAvatarColor(guest.name), display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 18 }}>
                      {getInitials(guest.name)}
                    </span>
                    <span style={{ fontWeight: 600 }}>{guest.name}</span>
                  </td>
                  <td style={{ color: "#888", padding: "12px 8px" }}>{guest.contact}</td>
                  <td style={{ padding: "12px 8px" }}>{guest.status}</td>
                  <td style={{ padding: "12px 8px" }}>{guest.time}</td>
                  <td style={{ padding: "12px 8px" }}>{guest.plusOne > 0 ? guest.plusOne : "No"}</td>
                  <td style={{ textAlign: "center", padding: "12px 8px" }}>
                    <span style={{ cursor: "pointer", color: "#388e3c", fontSize: 20, marginRight: 12 }} title="Edit Guest" onClick={() => handleEdit(guest)}>&#10003;</span>
                    <span style={{ cursor: "pointer", color: "#b71c1c", fontSize: 20 }} title="Delete Guest" onClick={() => handleDelete(guest._id)}>X</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Guest Summary */}
      <div style={{ background: "#f7e3c6", borderRadius: 12, margin: "32px 24px 0 24px", padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontFamily: "'Luckiest Guy', cursive, sans-serif", fontSize: "1.6rem", margin: 0, color: "#222" }}>GUEST SUMMARY</h2>
        <div style={{ color: "#444", margin: "8px 0 18px 0", fontSize: "1rem" }}>Overview of your guest list status</div>
        <div style={{ display: "flex", gap: 18, marginBottom: 18 }}>
          <div style={{ background: "#d6a5c0", color: "#fff", borderRadius: 10, padding: "18px 32px", minWidth: 120, textAlign: "center", fontWeight: 700, fontSize: "1.1rem" }}>
            Confirmed<br /><span style={{ fontSize: 22 }}>{confirmed}</span>
              </div>
          <div style={{ background: "#f7b5e6", color: "#fff", borderRadius: 10, padding: "18px 32px", minWidth: 120, textAlign: "center", fontWeight: 700, fontSize: "1.1rem" }}>
            Pending<br /><span style={{ fontSize: 22 }}>{pending}</span>
              </div>
          <div style={{ background: "#e0b2b2", color: "#fff", borderRadius: 10, padding: "18px 32px", minWidth: 120, textAlign: "center", fontWeight: 700, fontSize: "1.1rem" }}>
            Declined<br /><span style={{ fontSize: 22 }}>{declined}</span>
              </div>
            </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#222", fontWeight: 600, fontSize: "1.1rem" }}>
          <span>Total guest = {totalGuests}</span>
          <span>Plus one = {totalPlusOnes}</span>
        </div>
      </div>

      {/* Modal for Add/Edit Guest */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editId ? "Edit Guest" : "Add New Guest"}</h2>
            <form onSubmit={handleSubmit} className="guest-form">
              <div className="form-group">
                <label>Name:</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Contact:</label>
                <input type="tel" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Time:</label>
                <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Plus One:</label>
                <input type="number" min="0" value={form.plusOne} onChange={(e) => setForm({ ...form, plusOne: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">{editId ? "Update" : "Add"} Guest</button>
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setForm({ name: "", contact: "", status: "Pending", time: "Not responded", plusOne: 0 });
                }} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
