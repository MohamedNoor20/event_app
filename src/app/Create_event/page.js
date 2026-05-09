//create Event Form Page for organisers to add new events
//created by: Afaq Ahmed

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '', description: '', category: '', location: '', date: '', maxSeat: '', amount: ''
    });

    //update form state when user types
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    //submit form to API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/Event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const data = await res.json();

        if (data.success) {
            alert('Event created!');
            router.push('/Event');
        } else {
            setError(data.message);
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <Link href="/Event"><button className="btn-secondary">← Back</button></Link>

            <div className="form-container">
                <h1>Create New Event</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input type="text" name="title" required className="form-input" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" rows="4" className="form-textarea" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category *</label>
                        <input type="text" name="category" required className="form-input" onChange={handleChange} placeholder="e.g., Concert, Workshop" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location *</label>
                        <input type="text" name="location" required className="form-input" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date *</label>
                        <input type="date" name="date" required className="form-input" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Max Seats</label>
                        <input type="number" name="maxSeat" className="form-input" onChange={handleChange} placeholder="10" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Price ($)</label>
                        <input type="number" name="amount" step="0.01" className="form-input" onChange={handleChange} placeholder="0" />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}