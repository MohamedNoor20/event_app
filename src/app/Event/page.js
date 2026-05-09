//events Listing Page Shows all upcoming events
//created by: Afaq Ahmed

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    //fetch events when page loads
    useEffect(() => {
        fetch('/api/Event')
            .then(res => res.json())
            .then(data => {
                if (data.success) setEvents(data.events);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading events...</div>;

    return (
        <div className="container">
            <div className="events-header">
                <h1>🎉 Upcoming Events</h1>
                <Link href="/Create_event">
                    <button className="btn-success">+ Create Event</button>
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="event-card" style={{ textAlign: 'center' }}>
                    <p>No events yet. Be the first to create one!</p>
                </div>
            ) : (
                events.map(event => (
                    <div key={event.EventID} className="event-card">
                        <h2>{event.Title}</h2>
                        <p>{event.Description || 'Join us for this amazing event!'}</p>
                        <div className="event-details">
                            <div>📅 {new Date(event.Date).toLocaleDateString()}</div>
                            <div>📍 {event.Location}</div>
                            <div>🎟️ {event.MaxSeat} seats available</div>
                            <div>💰 ${event.Amount}</div>
                        </div>
                        <Link href={`/Event/${event.EventID}`}>
                            <button className="btn-primary">View Details →</button>
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}