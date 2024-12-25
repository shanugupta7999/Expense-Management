import React, { useState } from 'react';
import './SetBudget.css';  // Import the CSS file for styling
import { notification } from 'antd'; // Import notification from Ant Design

function SetBudget({ onBudgetSet }) {
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setBudget(value);
      setError('');
    } else {
      setError('Please enter a valid number');
    }
  };

  const handleSubmit = () => {
    if (budget > 0) {
      // Save the budget to localStorage
      localStorage.setItem('monthlyBudget', budget);
      setBudget('');
      // Notify the user that the budget has been set
      notification.success({
        message: 'Budget Set Successfully!',
        description: `Your monthly budget has been set to ₹${budget}.`,
      });
      setError('');
    } else {
      setError('Budget must be a positive number');
    }
  };

  return (
    <div className="set-budget-container">
      <h3>Set Your Monthly Budget</h3>
      <div className="budget-input-wrapper">
        <input
          type="text"
          value={budget}
          onChange={handleChange}
          className="budget-input"
          placeholder="Enter your budget"
        />
        <button className="set-budget-btn" onClick={handleSubmit}>
          Set Budget
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default SetBudget;
