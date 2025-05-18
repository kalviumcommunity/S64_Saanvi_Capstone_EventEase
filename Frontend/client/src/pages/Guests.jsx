import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Guest.css";

const STATUS_OPTIONS = ["Confirmed", "Pending", "Declined"];
const TIME_OPTIONS = ["On time", "A little late", "Not responded"];

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
      // Ensure plusOne is always a number
      const submitForm = {
        ...form,
        plusOne: form.plusOne === '' || form.plusOne == null ? 0 : Number(form.plusOne),
      };
      if (editId) {
        await axios.put(`/api/guests/${editId}`, submitForm);
      } else {
        await axios.post("/api/guests", submitForm);
      }
      setShowForm(false);
      setEditId(null);
      setForm({
        name: "",
        contact: "",
        status: "Pending",
        time: "Not responded",
        plusOne: 0,
      });
      await fetchGuests();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to save guest. Please try again."
      );
    }
  };

  // Delete guest
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this guest?")) return;
    setError(null);
    try {
      await axios.delete(`/api/guests/${id}`);
      await fetchGuests();
    } catch (err) {
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
      await axios.put(`/api/guests/${guest._id}`, { status: newStatus });
      await fetchGuests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status. Please try again.");
    }
  };

  // Toggle time
  const handleTimeToggle = async (guest) => {
    setError(null);
    const idx = TIME_OPTIONS.indexOf(guest.time);
    const newTime = TIME_OPTIONS[(idx + 1) % TIME_OPTIONS.length];
    try {
      await axios.put(`/api/guests/${guest._id}`, { time: newTime });
      await fetchGuests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update time. Please try again.");
    }
  };

  // Defensive: Only operate on guests if it's an array
  const guestList = Array.isArray(guests) ? guests : [];
  const confirmed = guestList.filter((g) => g.status === "Confirmed").length;
  const pending = guestList.filter((g) => g.status === "Pending").length;
  const declined = guestList.filter((g) => g.status === "Declined").length;
  const plusOne = guestList.reduce((sum, g) => sum + (g.plusOne || 0), 0);

  // Filtered guest list based on active filter
  const filteredGuestList = activeFilter === 'All'
    ? guestList
    : guestList.filter((g) => g.status === activeFilter);

  return (
    <div className="guest-page">
      <div className="guest-header">
        <h1>GUEST MANAGEMENT</h1>
        <p>
          Keep track of your event attendees, send invitations, and manage RSVPs all in one place
        </p>
        <div className="guest-controls">
          <input className="guest-search" placeholder="Search guest" />
          <button className="guest-btn">Export</button>
          <button className="guest-btn">Send Invitation</button>
          <button className="guest-btn add" onClick={() => { setShowForm(true); setEditId(null); }}>Add Guest</button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ 
          color: "red", 
          margin: "10px 24px", 
          padding: "10px",
          backgroundColor: "#ffebee",
          borderRadius: "4px",
          border: "1px solid #ffcdd2"
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="guest-form-modal">
          <form className="guest-form" onSubmit={handleSubmit}>
            <input
              placeholder="Guest Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="WhatsApp Number"
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
              required
            />
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              {STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <select
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
            >
              {TIME_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <input
              type="number"
              min="0"
              placeholder="Plus One"
              value={form.plusOne}
              onChange={e => setForm({ ...form, plusOne: Number(e.target.value) })}
            />
            <div className="form-actions">
              <button type="submit">{editId ? "Update" : "Add"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="guest-table-container">
        <div className="guest-table-filters">
          <label>
            <input type="checkbox" checked={activeFilter === 'All'} onChange={() => setActiveFilter('All')} />
            <span>All Guest</span>
          </label>
          <label>
            <input type="checkbox" checked={activeFilter === 'Confirmed'} onChange={() => setActiveFilter('Confirmed')} />
            <span>Confirmed</span>
          </label>
          <label>
            <input type="checkbox" checked={activeFilter === 'Pending'} onChange={() => setActiveFilter('Pending')} />
            <span>Pending</span>
          </label>
          <label>
            <input type="checkbox" checked={activeFilter === 'Declined'} onChange={() => setActiveFilter('Declined')} />
            <span>Declined</span>
          </label>
        </div>
        {loading ? (
          <div className="loading-message" style={{ 
            padding: "20px", 
            textAlign: "center",
            color: "#666"
          }}>
            Loading guests...
          </div>
        ) : (
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
              {filteredGuestList.map((g) => (
                <tr key={g._id}>
                  <td>
                    <span className="guest-avatar">🧑</span>
                    {g.name}
                  </td>
                  <td>{g.contact}</td>
                  <td>
                    <button 
                      className={`status-btn ${g.status.toLowerCase()}`} 
                      onClick={() => handleStatusToggle(g)}
                    >
                      {g.status}
                    </button>
                  </td>
                  <td>
                    <button 
                      className={`status-btn ${g.time.toLowerCase().replace(' ', '-')}`} 
                      onClick={() => handleTimeToggle(g)}
                    >
                      {g.time}
                    </button>
                  </td>
                  <td>{g.plusOne || 0}</td>
                  <td>
                    <span className="action-edit" onClick={() => handleEdit(g)}>✎</span>
                    <span className="action-remove" onClick={() => handleDelete(g._id)}>✗</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
