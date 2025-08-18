import React, { useState, useRef } from 'react';
import './SendReceipt.css';
import logo from '../assets/logo.png';
import { 
  FiUpload, 
  FiEye, 
  FiShare2, 
  FiMail, 
  FiMessageCircle, 
  FiDownload,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCalendar
} from 'react-icons/fi';

const SendReceipt = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    businessName: 'HussleWise User',
    businessPhone: '',
    businessAddress: '',
    businessEmail: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    paymentMethod: 'cash',
    notes: ''
  });
  
  const [businessLogo, setBusinessLogo] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);
  const receiptRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBusinessLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  const generateReceiptNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const allChars = letters + numbers;
    
    let receiptId = 'HW-';
    
    // Add 2 uppercase letters
    for (let i = 0; i < 2; i++) {
      receiptId += letters.charAt(Math.floor(Math.random() * 26)).toUpperCase();
    }
    
    // Add 3 numbers
    for (let i = 0; i < 3; i++) {
      receiptId += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    // Add 2 mixed case letters
    for (let i = 0; i < 2; i++) {
      receiptId += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    return receiptId;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const generateReceipt = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setShowPreview(true);
      setIsGenerating(false);
    }, 1000);
  };

  const shareViaWhatsApp = () => {
    const total = calculateTotal();
    const itemsList = formData.items.map(item => 
      `${item.description} - ${item.quantity} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.quantity * item.unitPrice)}`
    ).join('\n');
    
    const message = `*RECEIPT FROM ${formData.businessName.toUpperCase()}*\n\n` +
      `Receipt #: ${generateReceiptNumber()}\n` +
      `Date: ${new Date().toLocaleDateString()}\n` +
      `Customer: ${formData.customerName}\n\n` +
      `ITEMS:\n${itemsList}\n\n` +
      `*TOTAL: ${formatCurrency(total)}*\n` +
      `Payment Method: ${formData.paymentMethod.toUpperCase()}\n\n` +
      `${formData.notes ? `Notes: ${formData.notes}\n\n` : ''}` +
      `Thank you for your business!\n` +
      `Powered by HussleWise`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = formData.customerPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const shareViaEmail = () => {
    const total = calculateTotal();
    const subject = `Receipt from ${formData.businessName} - ${generateReceiptNumber()}`;
    const body = `Dear ${formData.customerName},\n\nThank you for your business! Please find your receipt details below:\n\nReceipt #: ${generateReceiptNumber()}\nDate: ${new Date().toLocaleDateString()}\nTotal: ${formatCurrency(total)}\nPayment Method: ${formData.paymentMethod}\n\nBest regards,\n${formData.businessName}\n\nPowered by HussleWise`;
    
    window.open(`mailto:${formData.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const downloadReceipt = () => {
    // In a real implementation, you'd convert the receipt to PDF
    alert('Receipt download functionality would be implemented with a PDF library like jsPDF');
  };

  if (showPreview) {
    return (
      <div className="send-receipt-container fade-in">
        <div className="receipt-preview-container">
          <div className="receipt-card">
            <div className="receipt-card-header">
              <h2 className="receipt-card-title">Receipt Preview</h2>
            </div>
            
            <div className="receipt-card-body">
              <div ref={receiptRef} className="receipt-document slide-up">
                {/* Receipt Header */}
                <div className="receipt-header">
                  <div className="receipt-top-section">
                    <div className="receipt-logos">
                      {/* HustleWise Logo */}
                      <div className="hustlewise-logo-container">
                        <img src={logo} alt="HustleWise" className="hustlewise-logo-img" />
                        <span className="hustlewise-text">Powered by HussleWise</span>
                      </div>
                      
                      {/* Business Logo */}
                      {businessLogo && (
                        <img src={businessLogo} alt="Business Logo" className="business-logo" />
                      )}
                    </div>
                    
                    <div className="receipt-business-info">
                      <h3 className="receipt-business-name">
                        {formData.businessName}
                      </h3>
                      {formData.businessPhone && (
                        <p className="receipt-business-detail">
                          <FiPhone size={14} style={{marginRight: '0.5rem', display: 'inline'}} />
                          {formData.businessPhone}
                        </p>
                      )}
                      {formData.businessEmail && (
                        <p className="receipt-business-detail">
                          <FiMail size={14} style={{marginRight: '0.5rem', display: 'inline'}} />
                          {formData.businessEmail}
                        </p>
                      )}
                      {formData.businessAddress && (
                        <p className="receipt-business-detail">
                          <FiMapPin size={14} style={{marginRight: '0.5rem', display: 'inline'}} />
                          {formData.businessAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="receipt-id-section">
                    <div className="receipt-id-badge">
                      RECEIPT #{generateReceiptNumber()}
                    </div>
                    <div className="receipt-date">
                      <FiCalendar size={14} style={{marginRight: '0.5rem', display: 'inline'}} />
                      {new Date().toLocaleDateString('en-NG', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* Customer Information Card */}
                <div className="customer-info-card">
                  <div className="customer-info-header">
                    <FiUser size={16} />
                    <span className="customer-title">Bill To</span>
                  </div>
                  <div className="customer-details">
                    <div className="customer-name">{formData.customerName}</div>
                    {formData.customerPhone && (
                      <div className="customer-contact">
                        <FiPhone size={14} style={{marginRight: '0.5rem', display: 'inline'}} />
                        {formData.customerPhone}
                      </div>
                    )}
                    {formData.customerEmail && (
                      <div className="customer-contact">
                        <FiMail size={14} style={{marginRight: '0.5rem', display: 'inline'}} />
                        {formData.customerEmail}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="receipt-items">
                  <div className="receipt-items-header">
                    <span className="receipt-items-title">Items & Services</span>
                  </div>
                  
                  <div className="items-table">
                    <div className="items-table-header">
                      <div className="col-description">Description</div>
                      <div className="col-qty">Qty</div>
                      <div className="col-price">Unit Price</div>
                      <div className="col-total">Total</div>
                    </div>
                    
                    {formData.items.map((item, index) => (
                      <div key={index} className="items-table-row">
                        <div className="col-description">
                          <div className="item-name">{item.description}</div>
                        </div>
                        <div className="col-qty">{item.quantity}</div>
                        <div className="col-price">{formatCurrency(item.unitPrice)}</div>
                        <div className="col-total item-total-amount">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Section */}
                <div className="receipt-total-section">
                  <div className="payment-method-badge">
                    <span>Payment Method: {formData.paymentMethod.toUpperCase()}</span>
                  </div>
                  
                  <div className="total-breakdown">
                    <div className="subtotal-row">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div className="total-row">
                      <span>Total Amount:</span>
                      <span className="total-amount-value">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {formData.notes && (
                  <div className="receipt-notes-section">
                    <div className="notes-header">
                      <span>Additional Notes</span>
                    </div>
                    <div className="notes-content">{formData.notes}</div>
                  </div>
                )}

                {/* Footer */}
                <div className="receipt-footer">
                  <div className="thank-you-message">
                    <span>Thank you for your business!</span>
                  </div>
                  <div className="powered-by">
                    <span>Powered by </span>
                    <span className="hustlewise-brand">HussleWise</span>
                  </div>
                  <div className="receipt-timestamp">
                    Generated on {new Date().toLocaleString('en-NG')}
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="share-section">
                <h4 className="share-title">Share Receipt</h4>
                <div className="share-buttons">
                  <button
                    onClick={shareViaWhatsApp}
                    className="share-btn share-btn-whatsapp"
                  >
                    <FiMessageCircle size={20} />
                    <span>WhatsApp</span>
                  </button>
                  
                  <button
                    onClick={shareViaEmail}
                    disabled={!formData.customerEmail}
                    className={`share-btn ${
                      formData.customerEmail ? 'share-btn-email' : 'share-btn-email'
                    }`}
                    style={{
                      opacity: formData.customerEmail ? 1 : 0.5,
                      cursor: formData.customerEmail ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <FiMail size={20} />
                    <span>Email</span>
                  </button>
                  
                  <button
                    onClick={downloadReceipt}
                    className="share-btn share-btn-download"
                  >
                    <FiDownload size={20} />
                    <span>Download</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Receipt from ' + formData.businessName,
                          text: 'Please find your receipt attached.',
                        });
                      } else {
                        alert('Web Share API not supported on this device');
                      }
                    }}
                    className="share-btn share-btn-general"
                  >
                    <FiShare2 size={20} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  onClick={() => setShowPreview(false)}
                  className="btn btn-secondary"
                >
                  Back to Edit
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      customerName: '',
                      customerPhone: '',
                      customerEmail: '',
                      businessName: '',
                      businessPhone: '',
                      businessAddress: '',
                      businessEmail: '',
                      items: [{ description: '', quantity: 1, unitPrice: 0 }],
                      paymentMethod: 'cash',
                      notes: ''
                    });
                    setBusinessLogo(null);
                    setShowPreview(false);
                  }}
                  className="btn btn-primary"
                >
                  Create New Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="send-receipt-container">
      <div className="send-receipt-wrapper">
        <div className="receipt-card fade-in">
          {/* Header */}
          <div className="receipt-card-header">
            <h1 className="receipt-card-title">Send Receipt</h1>
            <p className="receipt-card-subtitle">
              Generate and share professional receipts
            </p>
          </div>

          <div className="receipt-card-body">
            {/* Business Information */}
            <div className="form-section">
              <h3 className="section-title">Business Information</h3>
              
              <div className="form-group">
                <label className="form-label required">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Business Phone</label>
                  <input
                    type="tel"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    placeholder="+234..."
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Business Email</label>
                  <input
                    type="email"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Business Address</label>
                <textarea
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  placeholder="Street address, city, state"
                  className="form-textarea"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Logo (Optional)</label>
                <div className="logo-upload-section">
                  {businessLogo && (
                    <img src={businessLogo} alt="Business Logo" className="logo-preview" />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn logo-upload-btn"
                  >
                    <FiUpload size={16} />
                    Upload Logo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="form-section">
              <h3 className="section-title">Customer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="form-group">
                  <label className="form-label required">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="+234..."
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Optional)</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Items */}
            <div className="form-section">
              <h3 className="section-title">Items/Services</h3>
              
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="item-label">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Product or service"
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="item-label">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        className="form-input"
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
                      <div style={{ flex: 1 }}>
                        <label className="item-label">Unit Price (₦)</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          min="0"
                          step="0.01"
                          className="form-input"
                        />
                      </div>
                      
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addItem}
                className="btn btn-dashed btn-full"
              >
                + Add Item
              </button>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h3 className="section-title">Payment Details</h3>
              
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="cash">Cash</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="pos">POS</option>
                  <option value="card">Card Payment</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes or terms..."
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Total Display */}
            <div className="total-display">
              <div className="total-amount">
                <span className="total-label">Total Amount:</span>
                <span className="total-value">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                type="button"
                onClick={generateReceipt}
                disabled={!formData.customerName || formData.items.some(item => !item.description) || isGenerating}
                className={`btn btn-full ${
                  !formData.customerName || formData.items.some(item => !item.description) || isGenerating
                    ? 'btn-disabled'
                    : 'btn-primary'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="loading-spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiEye size={16} />
                    Preview Receipt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendReceipt;