import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Guest.css";

const STATUS_OPTIONS = ["Confirmed", "Pending", "Declined"];
const TIME_OPTIONS = ["On time", "A little late", "Not responded"];

export default function Guest() {
  const [guests, setGuests] = useState([]); // Always start as array!
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    status: "Pending",
    time: "Not responded",
    plusOne: 0,
  });
  const [editId, setEditId] = useState(null);

  // Fetch guests from backend
  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/guests");
      // Accept either array or object with guests property
      if (Array.isArray(res.data)) {
        setGuests(res.data);
      } else if (Array.isArray(res.data.guests)) {
        setGuests(res.data.guests);
      } else {
        setGuests([]);
        setError("API did not return a guest list.");
      }
    } catch (err) {
      setGuests([]);
      setError("Error fetching guests.");
    }
    setLoading(false);
  };

  // Add or update guest
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/guests/${editId}`, form);
      } else {
        await axios.post("/api/guests", form);
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
      fetchGuests();
    } catch (err) {
      setError("Error saving guest.");
    }
  };

  // Delete guest
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this guest?")) return;
    try {
      await axios.delete(`/api/guests/${id}`);
      fetchGuests();
    } catch (err) {
      setError("Error deleting guest.");
    }
  };

  // Edit guest
  const handleEdit = (guest) => {
    setForm({
      name: guest.name,
      contact: guest.contact,
      status: guest.status,
      time: guest.time,
      plusOne: guest.plusOne,
    });
    setEditId(guest._id);
    setShowForm(true);
  };

  // Toggle status
  const handleStatusToggle = async (guest) => {
    const idx = STATUS_OPTIONS.indexOf(guest.status);
    const newStatus = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
    try {
      await axios.put(`/api/guests/${guest._id}`, { status: newStatus });
      fetchGuests();
    } catch (err) {
      setError("Error updating status.");
    }
  };

  // Toggle time
  const handleTimeToggle = async (guest) => {
    const idx = TIME_OPTIONS.indexOf(guest.time);
    const newTime = TIME_OPTIONS[(idx + 1) % TIME_OPTIONS.length];
    try {
      await axios.put(`/api/guests/${guest._id}`, { time: newTime });
      fetchGuests();
    } catch (err) {
      setError("Error updating time.");
    }
  };

  // Defensive: Only operate on guests if it's an array
  const guestList = Array.isArray(guests) ? guests : [];
  const confirmed = guestList.filter((g) => g.status === "Confirmed").length;
  const pending = guestList.filter((g) => g.status === "Pending").length;
  const declined = guestList.filter((g) => g.status === "Declined").length;
  const plusOne = guestList.reduce((sum, g) => sum + (g.plusOne || 0), 0);

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

      {error && <div style={{ color: "red", margin: "10px 24px" }}>{error}</div>}

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
            <input type="checkbox" /> All Guest
          </label>
          <label>
            <input type="checkbox" /> Confirmed
          </label>
          <label>
            <input type="checkbox" /> Pending
          </label>
          <label>
            <input type="checkbox" /> Declined
          </label>
        </div>
        {loading ? (
          <div style={{ padding: 20 }}>Loading...</div>
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
              {guestList.map((g) => (
                <tr key={g._id}>
                  <td>
                    <span className="guest-avatar">🧑</span>
                    {g.name}
                  </td>
                  <td>{g.contact}</td>
                  <td>
                    <button className="status-btn" onClick={() => handleStatusToggle(g)}>
                      {g.status}
                    </button>
                  </td>
                  <td>
                    <button className="status-btn" onClick={() => handleTimeToggle(g)}>
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
        </div>
        <div className="summary-footer">
          Total guest = {guestList.length}
          <span className="plus-one">Plus one = {plusOne}</span>
        </div>
      </div>
    </div>
  );
}
