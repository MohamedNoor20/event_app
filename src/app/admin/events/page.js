"use client";

import { useEffect, useState } from "react";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      console.log("Events data:", data);
      setEvents(data.events || []);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId, eventTitle) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This will also delete all bookings for this event.`)) return;
    
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Event deleted successfully");
        fetchEvents();
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage(data.message || "Failed to delete event");
      }
    } catch (error) {
      setMessage("Error deleting event");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading events...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Manage Events</h1>

      {message && (
        <div style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "20px"
        }}>
          {message}
        </div>
      )}

      {events.length === 0 ? (
        <div style={{
          backgroundColor: "white",
          padding: "40px",
          textAlign: "center",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <p>No events found.</p>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "10px" }}>
            Events will appear here once they are created.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px" }}>
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>ID</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Title</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Category</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Location</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Date</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Price</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Created By</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.EventID} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "12px" }}>{event.EventID}</td>
                  <td style={{ padding: "12px" }}>{event.Title}</td>
                  <td style={{ padding: "12px" }}>{event.Category}</td>
                  <td style={{ padding: "12px" }}>{event.Location}</td>
                  <td style={{ padding: "12px" }}>{new Date(event.Date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px" }}>€{event.Amount}</td>
                  <td style={{ padding: "12px" }}>{event.Firstname || "Unknown"} {event.Lastname || ""}</td>
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() => deleteEvent(event.EventID, event.Title)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "5px 12px",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}