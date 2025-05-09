import React, { useState } from "react";
import "../Styles/ReviewPage.css";
import logo from "../assets/eventeaselogo.png";

const navSections = [
  "home",
  "vendor",
  "reviews",
  "budget",
  "dashboard",
  "guests",
  "profile"
];

const user = {
  username: "JaneDoe",
  avatar: "/default-avatar.png",
};

const initialReviews = [
  {
    id: 1,
    user: {
      name: "Alice",
      avatar: "/avatar1.png",
      verified: true,
      color: "#f87171"
    },
    date: "April 20, 2025",
    heading: "Amazing Service!",
    details: "The event was perfectly organized and the staff was super friendly.",
    stars: 5,
    likes: 36,
    replies: [
      { id: 1, user: "Bob", text: "Totally agree!", date: "April 21, 2025" }
    ],
  },
  {
    id: 2,
    user: {
      name: "Bob",
      avatar: "/avatar2.png",
      verified: true,
      color: "#fbbf24"
    },
    date: "April 18, 2025",
    heading: "Loved the Catering",
    details: "Food was delicious and beautifully presented.",
    stars: 4,
    likes: 33,
    replies: [],
  },
  {
    id: 3,
    user: {
      name: "Charlie",
      avatar: "/avatar3.png",
      verified: true,
      color: "#60a5fa"
    },
    date: "April 15, 2025",
    heading: "Great Venue",
    details: "Spacious and well-decorated. Would recommend!",
    stars: 5,
    likes: 17,
    replies: [],
  }
];

function ReviewPage() {
  const [activeSection, setActiveSection] = useState("reviews");
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    heading: "",
    details: "",
    stars: 5
  });
  const [replyInputs, setReplyInputs] = useState({}); // Track reply input per review id
  const [replyBoxes, setReplyBoxes] = useState({}); // Track which reply box is open

  // Navigation handler
  const navigateToSection = (section) => setActiveSection(section);

  // Controlled form input handlers for new review
  const handleNewReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  // Submit new review
  const handleNewReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.heading.trim() || !newReview.details.trim()) return;

    const reviewToAdd = {
      id: Date.now(),
      user: {
        name: user.username,
        avatar: user.avatar,
        verified: true,
        color: "#f472b6"
      },
      date: new Date().toLocaleDateString(),
      heading: newReview.heading,
      details: newReview.details,
      stars: Number(newReview.stars),
      likes: 0,
      replies: []
    };

    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ heading: "", details: "", stars: 5 });
    setShowForm(false);
  };

  // Like handler
  const handleLike = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  // Toggle reply box visibility
  const toggleReplyBox = (id) => {
    setReplyBoxes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Controlled reply input change
  const handleReplyInputChange = (id, value) => {
    setReplyInputs(prev => ({ ...prev, [id]: value }));
  };

  // Submit reply
  const handleReplySubmit = (id) => {
    const text = replyInputs[id];
    if (!text || !text.trim()) return;

    setReviews(reviews.map(r => {
      if (r.id === id) {
        const newReply = {
          id: Date.now(),
          user: user.username,
          text: text.trim(),
          date: new Date().toLocaleDateString()
        };
        return {
          ...r,
          replies: [...r.replies, newReply]
        };
      }
      return r;
    }));

    setReplyInputs(prev => ({ ...prev, [id]: "" }));
    setReplyBoxes(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="review-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="EventEase" className="logo" />
          <div className="nav-links">
            {navSections.map((section) => (
              <button
                key={section}
                className={`nav-link ${activeSection === section ? "active" : ""}`}
                onClick={() => navigateToSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button className="profile-btn">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt=""
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              marginRight: "0.5rem"
            }}
          />
          <span>{user?.username || "Profile"}</span>
        </button>
      </nav>

      <main className="review-main">
        <h1 className="review-title">USER REVIEWS</h1>
        <p className="review-subtitle">
          Read what others are saying about our platform and <br />
          <span className="underline">
            share your own experience with EventEase.
          </span>
        </p>
        <button className="write-review-btn" onClick={() => setShowForm(true)}>
          Write a Review
        </button>

        {/* Review Form */}
        {showForm && (
          <form className="review-form" onSubmit={handleNewReviewSubmit}>
            <input
              type="text"
              name="heading"
              placeholder="Review Heading"
              value={newReview.heading}
              onChange={handleNewReviewChange}
              required
            />
            <textarea
              name="details"
              placeholder="Detailed Review"
              value={newReview.details}
              onChange={handleNewReviewChange}
              required
            />
            <label>
              Stars:
              <select
                name="stars"
                value={newReview.stars}
                onChange={handleNewReviewChange}
              >
                {[5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit">Submit Review</button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-header">
                <div
                  className="avatar"
                  style={{ background: review.user.color }}
                >
                  <img src={review.user.avatar} alt="" />
                </div>
                <div className="review-meta">
                  <b>{review.user.name}</b>
                  {review.user.verified && (
                    <span className="verified-badge">Verified</span>
                  )}
                  <div className="review-date">{review.date}</div>
                </div>
                <div className="review-stars">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
              <div className="review-content">
                <div className="review-heading">{review.heading}</div>
                <div className="review-details">{review.details}</div>
                <div className="read-more">Read more</div>
              </div>
              <div className="review-actions">
                <button className="like-btn" onClick={() => handleLike(review.id)}>
                  <span role="img" aria-label="like">👍</span> {review.likes}
                </button>
                <button className="reply-btn" onClick={() => toggleReplyBox(review.id)}>
                  <span role="img" aria-label="reply">💬</span> {review.replies.length}
                </button>
                <button className="reply-link" onClick={() => toggleReplyBox(review.id)}>
                  Reply
                </button>
              </div>

              {/* Replies */}
              <div className="replies-section">
                {review.replies.map((reply) => (
                  <div className="reply" key={reply.id}>
                    <b>{reply.user}</b> <span>{reply.text}</span>
                    <span className="reply-date">{reply.date}</span>
                  </div>
                ))}

                {replyBoxes[review.id] && (
                  <div className="reply-box">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyInputs[review.id] || ""}
                      onChange={(e) => handleReplyInputChange(review.id, e.target.value)}
                    />
                    <button onClick={() => handleReplySubmit(review.id)}>Send</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ReviewPage;
