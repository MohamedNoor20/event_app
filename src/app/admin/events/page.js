"use client";

import { useEffect, useState } from "react";

// This page gives access to admin to see events and delete any of them
export default function AdminEvents() {
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");
useEffect(() => {
//Load events
    fetchEvents();
  }, []);
const fetchEvents = async () => {
try {
const res = await fetch("/api/admin/events");
const data = await res.json();
setEvents(data.events || []);
    } 
catch (error) {
setMessage("Failed to load events");
    }
finally {
setLoading(false);
    }
  };
// Deleting an event
const deleteEvent = async (eventId) => {
const confirmed = confirm("Do you want to delete this event? This will  delete all bookings related to the event.");
if (!confirmed) return;
try {
const res = await fetch(`/api/admin/events/${eventId}`, {
method: "DELETE"
});
if (res.ok) {
setMessage("Event is deleted successfully");
fetchEvents(); // Refresh the list
setTimeout(() => setMessage(""), 2000);
      } 
else {
setMessage("Failed to delete event");
      }
    }
catch (error) {
setMessage("Error while deleting event");
    }
  };

if (loading) {
    return <div className="text-center p-10">Loading events...</div>;
  
}
return (
<div>
<h1 className="text-2xl font-bold mb-6">Manage Events</h1>
{message && (
<div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">{message}</div>
      )}
<div className="bg-white rounded-lg shadow overflow-x-auto">
<table className="w-full">
<thead className="bg-gray-50">
<tr>
  <th className="p-3 text-left">ID</th>
  <th className="p-3 text-left">Title</th>
  <th className="p-3 text-left">Category</th>
  <th className="p-3 text-left">Location</th>
  <th className="p-3 text-left">Date</th>
  <th className="p-3 text-left">Price</th>
  <th className="p-3 text-left">Max Seats</th>
  <th className="p-3 text-left">Created By</th>
  <th className="p-3 text-left">Actions</th>
    </tr>
</thead>
 <tbody>
  {events.map((event) => (
    <tr key={event.EventID} className="border-t">
    <td className="p-3">{event.EventID}</td>
    <td className="p-3">{event.Title}</td>
    <td className="p-3">{event.Category}</td>
    <td className="p-3">{event.Location}</td>
    <td className="p-3">{new Date(event.Date).toLocaleDateString()}</td>
    <td className="p-3">€{event.Amount}</td>
    <td className="p-3">{event.MaxSeat}</td>
    <td className="p-3">{event.Firstname} {event.Lastname}</td>
    <td className="p-3">
{/*Creating button to delete event */}
<button
onClick={() => deleteEvent(event.EventID)}
className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" > Delete</button>
</td>
</tr>
    ))}
     </tbody>
    </table>
    </div>
    </div>
  );
}
