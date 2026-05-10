//events Listing Page Shows all upcoming events
//created by: Afaq Ahmed

'use client';

import { useState, useEffect } from 'react';
import { UserInfo } from "@/components/UserInfo";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // fetch events on load
  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/Event');
        const data = await res.json();

        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');

        if (!res.ok) return;

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
    fetchUser();

  }, []);

  // loading state
  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading events...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div>
        <UserInfo />
      </div>

      {/* Header */}
      <div className="events-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🎉 Upcoming Events</h1>

        {user && (user.Role === 'admin' || user.Role === 'organiser') &&
          (
            <a href="/Create_event" style={{ textDecoration: 'none' }}>
              <button className="btn-success">
                + Create Event
              </button>
            </a>
          )}
      </div>

      {/* No events */}
      {events.length === 0 ? (
        <div className="event-card" style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>No events available right now.</p>
        </div>
      ) : (
        /* Events List */
        <div style={{ marginTop: '20px' }}>
          {events.map((event) => (
            <div key={event.EventID} className="event-card" style={{ marginBottom: '20px' }}>
              <h2>{event.Title}</h2>

              <p>
                {event.Description
                  ? event.Description
                  : 'Join us for this amazing event!'}
              </p>

              <div className="event-details" style={{ marginTop: '10px' }}>
                <div>📅 Date: {new Date(event.Date).toLocaleDateString()}</div>
                <div>📍 Location: {event.Location}</div>
                <div>📂 Category: {event.Category}</div>
                <div>🎟️ Seats: {event.MaxSeat}</div>
                <div>💰 Price: ${event.Amount}</div>
              </div>

                {/* Optional: simple action */}
              <div style={{ marginTop: '15px' }}>
                <a href={`/Book?eventId=${event.EventID}`} style={{ textDecoration: 'none' }}>
                  <button className="btn-primary">
                    Book Now
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}