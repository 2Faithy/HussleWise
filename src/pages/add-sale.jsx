import { useState, useEffect } from 'react';  // Added useEffect import
import AOS from 'aos';
import 'aos/dist/aos.css';
import './add-sale.css';

const AddSale = () => {
  const [saleData, setSaleData] = useState({
    amount: '',
    item: '',
    category: 'product',
    paymentMethod: 'cash',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [showCustomerFields, setShowCustomerFields] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sale recorded:', saleData);
    // Here you would typically send the data to your backend
    alert('Sale recorded successfully!');
    // Reset form or redirect as needed
  };

  return (
    <div className="add-sale-container">
      <div className="add-sale-header" data-aos="fade-down">
        <h2>Record New Sale</h2>
        <p>Track money coming into your business</p>
      </div>

      <form onSubmit={handleSubmit} className="sale-form">
        <div className="form-section" data-aos="fade-up">
          <h3>Sale Details</h3>
          
          <div className="form-group">
            <label>Amount (₦) *</label>
            <input
              type="number"
              name="amount"
              value={saleData.amount}
              onChange={handleChange}
              placeholder="5000"
              required
            />
          </div>

          <div className="form-group">
            <label>Item/Service *</label>
            <input
              type="text"
              name="item"
              value={saleData.item}
              onChange={handleChange}
              placeholder="What was sold?"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={saleData.category}
              onChange={handleChange}
              required
            >
              <option value="product">Product Sale</option>
              <option value="service">Service</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Method *</label>
            <select
              name="paymentMethod"
              value={saleData.paymentMethod}
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
              value={saleData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              value={saleData.notes}
              onChange={handleChange}
              placeholder="Any additional information"
              rows="3"
            />
          </div>
        </div>

        <div className="customer-toggle" data-aos="fade-up">
          <button
            type="button"
            className={`toggle-btn ${showCustomerFields ? 'active' : ''}`}
            onClick={() => setShowCustomerFields(!showCustomerFields)}
          >
            {showCustomerFields ? 'Hide Customer Details' : 'Add Customer Details'}
          </button>
        </div>

        {showCustomerFields && (
          <div className="form-section" data-aos="fade-up">
            <h3>Customer Information</h3>
            
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={saleData.customerName}
                onChange={handleChange}
                placeholder="Customer's name"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="customerPhone"
                value={saleData.customerPhone}
                onChange={handleChange}
                placeholder="08012345678"
              />
            </div>

            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                name="customerEmail"
                value={saleData.customerEmail}
                onChange={handleChange}
                placeholder="customer@email.com"
              />
            </div>
          </div>
        )}

        <div className="form-actions" data-aos="fade-up">
          <button type="submit" className="submit-btn">
            Record Sale
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSale;