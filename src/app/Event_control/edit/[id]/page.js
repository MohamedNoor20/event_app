//this is for edit event page to edit the existing events
//created by: Afaq Ahmed

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditEventPage({ params }) {
    const { id } = use(params);
    //state for loading, error, and form data
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '', description: '', category: '', location: '', date: '', maxSeat: '', amount: ''
    });

    //load existing event data when page loads
    useEffect(() => {
        fetch(`/api/Event?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Fill form with existing event data
                    setForm({
                        title: data.event.Title,
                        description: data.event.Description || '',
                        category: data.event.Category,
                        location: data.event.Location,
                        date: data.event.Date,
                        maxSeat: data.event.MaxSeat,
                        amount: data.event.Amount
                    });
                }
            });
    }, [id]);

    //update form state when user types in any field
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    //submit updated event to API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        //send PUT request to update event
        const res = await fetch('/api/Event', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId: id, ...form })
        });
        const data = await res.json();

        if (data.success) {
            alert('Event updated!');
            router.push('/Event_control');
        } else {
            setError(data.message);
        }
        setLoading(false);
    };

    return (
        <div className="container">
            {/*back button to returns to control panel */}
            <a href="/Event_control">
                <button className="btn-secondary">← Back</button>
            </a>

            <div className="form-container">
                <h1>Edit Event</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Title input field */}
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input type="text" name="title" value={form.title} required className="form-input" onChange={handleChange} />
                    </div>

                    {/* Description textarea */}
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" rows="4" value={form.description} className="form-textarea" onChange={handleChange} />
                    </div>

                    {/* Category input */}
                    <div className="form-group">
                        <label className="form-label">Category *</label>
                        <input type="text" name="category" value={form.category} required className="form-input" onChange={handleChange} />
                    </div>

                    {/* Location input */}
                    <div className="form-group">
                        <label className="form-label">Location *</label>
                        <input type="text" name="location" value={form.location} required className="form-input" onChange={handleChange} />
                    </div>

                    {/* Date picker */}
                    <div className="form-group">
                        <label className="form-label">Date *</label>
                        <input type="date" name="date" value={form.date} required className="form-input" onChange={handleChange} />
                    </div>

                    {/* Max seats number input */}
                    <div className="form-group">
                        <label className="form-label">Max Seats</label>
                        <input type="number" name="maxSeat" value={form.maxSeat} className="form-input" onChange={handleChange} />
                    </div>

                    {/* Price input */}
                    <div className="form-group">
                        <label className="form-label">Price ($)</label>
                        <input type="number" name="amount" step="0.01" value={form.amount} className="form-input" onChange={handleChange} />
                    </div>

                    {/* Submit button this shows loading text when saving */}
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}