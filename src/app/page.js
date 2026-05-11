"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import "../style/globals.css";

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/Book');
      const data = await res.json();
      
      if (res.ok && data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser().then(() => {
        fetchBookings();
    });
  }, []);

  const handleCancelBooking = async (bookId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/api/Book?bookId=${bookId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        fetchBookings();
      } else {
        alert(data.message || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while trying to cancel.");
    }
  };

  if (loading) {
    return <div className="pageContainer"><h2 className="headerTitle centerMt50">Loading...</h2></div>;
  }

  // Not logged in - show welcome screen
  if (!user) {
    return (
      <div className="successContainer">
        <div className="successCard heroCard">
          <h1 className="headerTitle heroTitle">
            Welcome to EventApp 🎉
          </h1>

          <div className="flexCenterGap1">
            <Link href="/sign/in">
              <button className="btn-primary btnLarge">
                Sign In
              </button>
            </Link>
            <Link href="/sign/up">
              <button className="cancelBtn btnLarge">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in as Admin or Organiser - show dashboard
  if (user.Role === 'admin' || user.Role === 'organiser') {
    return (
      <div className="pageContainer">
        <div className="contentWrapper">
          <div className="card cardCentered">
            <h1 className="headerTitle">Welcome, {user.Firstname}!</h1>
            <p className="successText mt1">
              Head over to the Event Control panel to manage your events.
            </p>
            <div className="actionButtons actionButtonsCenter">
              <Link href="/Event">
                <button className="btn-primary">Browse Events</button>
              </Link>
              <Link href="/Event_control">
                <button className="btn-success">Manage Events</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in as standard user (Attendee) - show bookings
  return (
    <div className="pageContainer">
      <div className="contentWrapper">
        <div className="events-header headerFlexWrap">
          <div>
            <h1 className="headerTitle">Welcome back, {user.Firstname}!</h1>
            <p className="headerSubtitle">Here are your upcoming booked events.</p>
          </div>
          
          <Link href="/Event">
            <button className="btn-primary">Browse More Events</button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="card cardCentered">
            <p className="successText text12">You did not book any events yet.</p>
            <Link href="/Event">
              <button className="btn-primary mt1">Book your first Event here</button>
            </Link>
          </div>
        ) : (
          <div className="flexColGap15">
            {bookings.map((booking) => (
              <div key={booking.BookID} className="event-card eventCardFlex">
                <div className="flex1Min">
                  <h2 className="eventTitleSm">{booking.Title}</h2>
                  <p className="eventCardDetails">
                    📅 {new Date(booking.Date).toLocaleDateString()} | 📍 {booking.Location}
                  </p>
                  <div className="pricePill">
                    💰 {booking.Amount > 0 ? `€${booking.Amount}` : 'Free'}
                  </div>
                </div>
                
                <div>
                  <button 
                    className="cancelBtn dangerBorder" 
                    onClick={() => handleCancelBooking(booking.BookID)}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}