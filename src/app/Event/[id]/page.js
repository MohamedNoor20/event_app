//event details Page shows single event information
//created by: Afaq Ahmed

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EventDetail({ params }) {
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    //fetch event when page loads
    useEffect(() => {
        fetch(`/api/Event?id=${params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setEvent(data.event);
                setLoading(false);
            });
    }, [params.id]);

    //delete event function
    const handleDelete = async () => {
        if (!confirm('Delete this event? Cannot undo.')) return;

        const res = await fetch(`/api/Event?id=${params.id}`, { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
            alert('Event deleted');
            router.push('/Event');
        } else {
            alert(data.message);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!event) return <div className="container">Event not found</div>;

    return (
        <div className="container">
            <Link href="/Event"><button className="btn-secondary">← All Events</button></Link>

            <div className="event-card">
                <h1>{event.Title}</h1>
                <div className="event-details">
                    <div>📅 Date: {new Date(event.Date).toLocaleDateString()}</div>
                    <div>📍 Location: {event.Location}</div>
                    <div>📂 Category: {event.Category}</div>
                    <div>🎟️ Seats: {event.MaxSeat}</div>
                    <div>💰 Price: ${event.Amount}</div>
                </div>
                <p>{event.Description || 'No description provided.'}</p>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button className="btn-primary">Book Now</button>
                    <button className="btn-danger" onClick={handleDelete}>Delete Event</button>
                </div>
            </div>
        </div>
    );
}