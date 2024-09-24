"use client";

import { useState } from 'react';

export default function UpdateAddressPage() {
    const [newAddress, setNewAddress] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        province: '',
        country: '',
        zip: '',
        phone: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Prompt for email
        const email = prompt("Please enter your email:");

        if (!email) {
            setMessage("Email is required.");
            return;
        }

        const response = await fetch('/api/update-customer-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newAddress }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage('Address updated successfully!');
        } else {
            setMessage(`Error: ${data.error}`);
        }
    };

    return (
        <div>
            <h1>Update Customer Address</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={newAddress.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={newAddress.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="address1"
                    placeholder="Address"
                    value={newAddress.address1}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="province"
                    placeholder="Province"
                    value={newAddress.province}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="zip"
                    placeholder="Zip Code"
                    value={newAddress.zip}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Update Address</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
