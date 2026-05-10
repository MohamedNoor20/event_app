//show list of people who booked an event
//created by: Afaq Ahmed

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/components/nav/nav";
import { UserInfo } from "@/components/UserInfo";

export default function EventBookingsPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [eventTitle, setEventTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        //fetch event details
        fetch(`/api/Event?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEventTitle(data.event.Title);
                }
            });

        //fetch bookings for this event
        fetch(`/api/event_bookings/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setBookings(data.bookings);
                } else if (data.message === 'Access denied') {
                    setError('You do not have permission to view these bookings');
                    setTimeout(() => router.push('/Event_control'), 2000);
                } else {
                    setError(data.message);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load bookings');
                setLoading(false);
            });
    }, [id, router]);

    if (loading) {
        return (
            <div>
                <UserInfo />
                <Navbar />
                <div className="container" style={{ textAlign: 'center' }}>
                    <p>Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <UserInfo />
            <Navbar />

            <div className="container">
                <div className="events-header">
                    <h1>📋 Bookings for: {eventTitle}</h1>
                    <a href="/Event_control">
                        <button className="btn-secondary">← Back</button>
                    </a>
                </div>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                {!error && bookings.length === 0 && (
                    <div className="empty-state">
                        <p>No one has booked this event yet.</p>
                    </div>
                )}

                {!error && bookings.length > 0 && (
                    <div className="bookings-table">
                        <div className="table-header">
                            <div className="table-cell">#</div>
                            <div className="table-cell">Name</div>
                            <div className="table-cell">Username</div>
                            <div className="table-cell">Email</div>
                            <div className="table-cell">Booking ID</div>
                        </div>

                        {bookings.map((booking, index) => (
                            <div key={booking.BookID} className="table-row">
                                <div className="table-cell">{index + 1}</div>
                                <div className="table-cell">{booking.Firstname} {booking.Lastname}</div>
                                <div className="table-cell">{booking.Username}</div>
                                <div className="table-cell">{booking.Email || 'No email'}</div>
                                <div className="table-cell">#{booking.BookID}</div>
                            </div>
                        ))}

                        <div className="booking-total">
                            Total Bookings: {bookings.length} / {bookings.length}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}