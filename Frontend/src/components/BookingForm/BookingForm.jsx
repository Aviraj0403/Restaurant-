// src/components/BookingForm/BookingForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function BookingForm() {
  const [tableNumber, setTableNumber] = useState('');
  const [bookedBy, setBookedBy] = useState('');
  const [order, setOrder] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/bookings`, {
        tableNumber,
        bookedBy,
        order,
      });

      toast.success('Booking successful!');
      // Clear form fields
      setTableNumber('');
      setBookedBy('');
      setOrder('');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book the table. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book a Table</h2>
      <label>
        Table Number:
        <input
          type="number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          required
        />
      </label>
      <label>
        Your Name:
        <input
          type="text"
          value={bookedBy}
          onChange={(e) => setBookedBy(e.target.value)}
          required
        />
      </label>
      <label>
        Order Details:
        <textarea
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          required
        />
      </label>
      <button type="submit">Book Table</button>
    </form>
  );
}
