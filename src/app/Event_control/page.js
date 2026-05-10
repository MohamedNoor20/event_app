'use client';

import { useState, useEffect } from 'react';

export default function EventControl() {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/me') // you need this endpoint
            .then(res => res.json())
            .then(data => setUser(data.user));

        fetch('/api/Event')
            .then(res => res.json())
            .then(data => {
                if (data.success) setEvents(data.events);
            });
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this event?')) return;

        const res = await fetch(`/api/Event?id=${id}`, {
            method: 'DELETE'
        });

        const data = await res.json();

        if (data.success) {
            setEvents(events.filter(e => e.EventID !== id));
        } else {
            alert(data.message);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1>⚙️ Event Control Panel</h1>

            {events.map(event => {
                
                const canManage =
                    user.Role === 'admin' ||
                    user.UserID === event.UserID;

                if (!canManage) return null;

                return (
                    <div key={event.EventID} className="event-card">
                        <h2>{event.Title}</h2>

                        <div className="event-details">
                            <div>📅 {new Date(event.Date).toLocaleDateString()}</div>
                            <div>📍 {event.Location}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-warning">
                                Edit
                            </button>

                            <button
                                className="btn-danger"
                                onClick={() => handleDelete(event.EventID)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}