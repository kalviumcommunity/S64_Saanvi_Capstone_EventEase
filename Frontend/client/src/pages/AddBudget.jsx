import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBudget = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState({
    title: '',
    amount: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to save budget
    console.log('Budget data:', budget);
    navigate('/budget');
  };

  const handleChange = (e) => {
    setBudget({
      ...budget,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="add-budget-container">
      <h1>Add New Budget</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={budget.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={budget.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={budget.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Budget</button>
      </form>
    </div>
  );
};

export default AddBudget; 