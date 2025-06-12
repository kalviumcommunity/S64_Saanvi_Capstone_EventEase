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

  // Dummy data for fallback
  const dummyGuests = [
    {
      _id: "1",
      name: "Alice Johnson",
      contact: "+1 555-1234",
      status: "Confirmed",
      time: "On time",
      plusOne: 1,
    },
    {
      _id: "2",
      name: "Bob Smith",
      contact: "+1 555-5678",
      status: "Pending",
      time: "Not responded",
      plusOne: 0,
    },
    {
      _id: "3",
      name: "Charlie Lee",
      contact: "+1 555-8765",
      status: "Declined",
      time: "A little late",
      plusOne: 0,
    },
    {
      _id: "4",
      name: "Diana Prince",
      contact: "+1 555-4321",
      status: "Confirmed",
      time: "On time",
      plusOne: 2,
    },
  ];

  const fetchGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/guests");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setGuests(res.data);
      } else if (Array.isArray(res.data.guests) && res.data.guests.length > 0) {
        setGuests(res.data.guests);
      } else {
        setGuests(dummyGuests); // fallback to dummy data
      }
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError(err.response?.data?.message || "Failed to fetch guests. Showing sample data.");
      setGuests(dummyGuests); // fallback to dummy data
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
      }
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError(err.response?.data?.message || "Failed to delete guest. Please try again.");
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
    }
  };

  // Export guests to CSV
  const handleExport = () => {
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
    }
  };

  // Defensive: Only operate on guests if it's an array
  const guestList = Array.isArray(guests) ? guests : [];
  const confirmed = guestList.filter((g) => g.status === "Confirmed").length;
  const pending = guestList.filter((g) => g.status === "Pending").length;
  const declined = guestList.filter((g) => g.status === "Declined").length;
  const plusOne = guestList.reduce((sum, g) => sum + (g.plusOne || 0), 0);

  // Filtered guest list based on active filter and search query
  const filteredGuestList = guestList
    .filter((g) => activeFilter === 'All' || g.status === activeFilter)
    .filter((g) => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="guest-page">
      <div className="guest-header">
        <h1>GUEST MANAGEMENT</h1>
        <p>
          Keep track of your event attendees, send invitations, and manage RSVPs all in one place
        </p>
        <div className="guest-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input 
              className="guest-search" 
              placeholder="Search guest" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="guest-btn" onClick={handleExport}>
            <FaFileExport /> Export
          </button>
          <button className="guest-btn add" onClick={() => { setShowForm(true); setEditId(null); }}>
            Add Guest
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="guest-form-modal">
          <div className="modal-content">
            <h2>{editId ? "Edit Guest" : "Add New Guest"}</h2>
            <form className="guest-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Guest Name *</label>
                <input
                  type="text"
                  placeholder="Enter guest name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Time</label>
                <select
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                >
                  {TIME_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Plus One</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Number of plus ones"
                  value={form.plusOne}
                  onChange={e => setForm({ ...form, plusOne: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editId ? "Update Guest" : "Add Guest"}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                    setForm({
                      name: "",
                      contact: "",
                      status: "Pending",
                      time: "Not responded",
                      plusOne: 0,
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="guest-table-container">
        <div className="guest-table-filters">
          <label className={activeFilter === 'All' ? 'active' : ''} onClick={() => setActiveFilter('All')}>
            <span>All</span>
          </label>
          <label className={activeFilter === 'Confirmed' ? 'active' : ''} onClick={() => setActiveFilter('Confirmed')}>
            <span>Confirmed</span>
          </label>
          <label className={activeFilter === 'Pending' ? 'active' : ''} onClick={() => setActiveFilter('Pending')}>
            <span>Pending</span>
          </label>
          <label className={activeFilter === 'Declined' ? 'active' : ''} onClick={() => setActiveFilter('Declined')}>
            <span>Declined</span>
          </label>
        </div>

        <table className="guest-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Time</th>
              <th>Plus One</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuestList.map((guest) => (
              <tr key={guest._id}>
                <td>
                  <div className="guest-avatar">{guest.name[0]}</div>
                  {guest.name}
                </td>
                <td>{guest.contact}</td>
                <td>
                  <button 
                    className={`status-btn ${guest.status.toLowerCase()}`}
                    onClick={() => handleStatusToggle(guest)}
                  >
                    {guest.status}
                  </button>
                </td>
                <td>
                  <button 
                    className={`status-btn ${guest.time.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleTimeToggle(guest)}
                  >
                    {guest.time}
                  </button>
                </td>
                <td>{guest.plusOne || 0}</td>
                <td>
                  <button className="action-btn" onClick={() => handleSendInvitation(guest)}>
                    <FaEnvelope />
                  </button>
                  <button className="action-btn" onClick={() => handleEdit(guest)}>
                    <FaEdit />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(guest._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="guest-summary">
        <h2>GUEST SUMMARY</h2>
        <div className="summary-desc">Overview of your guest list status</div>
        <div className="summary-boxes">
          <div className="summary-box confirmed">
            <div>Confirmed</div>
            <div>{confirmed}</div>
          </div>
          <div className="summary-box pending">
            <div>Pending</div>
            <div>{pending}</div>
          </div>
          <div className="summary-box declined">
            <div>Declined</div>
            <div>{declined}</div>
          </div>
          <div className="summary-box plus-one">
            <div>Plus One</div>
            <div>{plusOne}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
