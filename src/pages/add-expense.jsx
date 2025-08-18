import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './add-expense.css';

const AddExpense = () => {
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    category: 'supplies',
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurrence: 'none',
    receipt: null,
    notes: ''
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpenseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setExpenseData(prev => ({
      ...prev,
      receipt: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Expense recorded:', expenseData);
    // Here you would typically send the data to your backend
    alert('Expense recorded successfully!');
  };

  return (
    <div className="add-expense-container">
      <div className="add-expense-header" data-aos="fade-down">
        <h2>Record New Expense</h2>
        <p>Track money going out of your business</p>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-section" data-aos="fade-up">
          <h3>Expense Details</h3>
          
          <div className="form-group">
            <label>Amount (₦) *</label>
            <input
              type="number"
              name="amount"
              value={expenseData.amount}
              onChange={handleChange}
              placeholder="5000"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              name="description"
              value={expenseData.description}
              onChange={handleChange}
              placeholder="What was this expense for?"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={expenseData.category}
              onChange={handleChange}
              required
            >
              <option value="supplies">Supplies/Materials</option>
              <option value="transport">Transport</option>
              <option value="rent">Rent</option>
              <option value="utilities">Utilities</option>
              <option value="salary">Salary/Wages</option>
              <option value="marketing">Marketing</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Method *</label>
            <select
              name="paymentMethod"
              value={expenseData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="cash">Cash</option>
              <option value="transfer">Bank Transfer</option>
              <option value="pos">POS</option>
              <option value="ussd">USSD</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={expenseData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section" data-aos="fade-up">
          <h3>Additional Information</h3>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isRecurring"
                checked={expenseData.isRecurring}
                onChange={handleChange}
              />
              <span>Recurring Expense</span>
            </label>
          </div>

          {expenseData.isRecurring && (
            <div className="form-group">
              <label>Recurrence Frequency *</label>
              <select
                name="recurrence"
                value={expenseData.recurrence}
                onChange={handleChange}
                required={expenseData.isRecurring}
              >
                <option value="none">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Upload Receipt (Optional)</label>
            <input
              type="file"
              name="receipt"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              value={expenseData.notes}
              onChange={handleChange}
              placeholder="Any additional information about this expense"
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions" data-aos="fade-up">
          <button type="submit" className="submit-btn">
            Record Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;