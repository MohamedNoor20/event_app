"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import "../../style/globals.css";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId"); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [user, setUser] = useState(null);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!eventId) {
        setErrorMsg("No event selected.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch logged-in user details
        const userRes = await fetch('/api/me');
        const userData = await userRes.json();
        
        if (!userData.success) {
          router.push('/sign/in');
          return;
        }

        // Fetch event details
        const eventRes = await fetch(`/api/Event?id=${eventId}`);
        const eventData = await eventRes.json();

        if (!eventData.success || !eventData.event) {
          setErrorMsg("Event not found.");
          setIsLoading(false);
          return;
        }

        setUser({
          id: userData.user.UserID,
          firstName: userData.user.Firstname,
          lastName: userData.user.Lastname,
          email: userData.user.Username,
        });

        const formattedDate = new Date(eventData.event.Date).toLocaleDateString();

        setTicket({
          id: eventData.event.EventID,
          eventName: eventData.event.Title,
          date: formattedDate,
          location: eventData.event.Location,
          price: eventData.event.Amount > 0 ? `€${eventData.event.Amount}` : "Free",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMsg("Failed to load booking details.");
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [eventId, router]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(""); // Clear old errors

    try {
      // Send the booking request to our API
      const res = await fetch('/api/Book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: ticket.id }),
      });

      const data = await res.json();

      if (data.success) {
        setBookingSuccess(true);
        setIsSubmitting(false);
        
        // Redirect home after showing success message
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        // Show the error from the backend
        setErrorMsg(data.message);
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="pageContainer"><h2 className="headerTitle" style={{textAlign: 'center', marginTop: '50px'}}>Loading booking details...</h2></div>;
  }

  if (bookingSuccess) {
    return (
      <div className="successContainer">
        <div className="successCard">
          <h2 className="successTitle">Booking Confirmed! 🎉</h2>
          <p className="successText">
            Thank you, {user.firstName}. Your ticket for <strong>{ticket.eventName}</strong> has been successfully booked.
          </p>
          <p className="successSubtext">Redirecting you to the home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pageContainer">
      <div className="contentWrapper">
        <div>
          <h1 className="headerTitle">Review Your Booking</h1>
          <p className="headerSubtitle">Please double-check your information and the event details before confirming.</p>
        </div>
        
        {/* If there is an error booking (e.g. already booked), show it here */}
        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>
            {errorMsg}
          </div>
        )}

        <div className="card">
          <div className="sectionHeaderBlue"><h3 className="sectionTitleBlue">Ticket Information</h3></div>
          <div>
            <dl className="dlList">
              <div className="dlRow"><dt className="dtLabel">Event</dt><dd className="ddValue ddValueBold">{ticket.eventName}</dd></div>
              <div className="dlRow"><dt className="dtLabel">Date</dt><dd className="ddValue">{ticket.date}</dd></div>
              <div className="dlRow"><dt className="dtLabel">Location</dt><dd className="ddValue">{ticket.location}</dd></div>
              <div className="dlRow"><dt className="dtLabel">Total Price</dt><dd className="ddValue ddValuePrice">{ticket.price}</dd></div>
            </dl>
          </div>
          <div className="sectionHeaderGray"><h3 className="sectionTitleGray">Your Details</h3></div>
          <div>
            <dl className="dlList">
              <div className="dlRow"><dt className="dtLabel">Full name</dt><dd className="ddValue">{user.firstName} {user.lastName}</dd></div>
              <div className="dlRow"><dt className="dtLabel">Email address</dt><dd className="ddValue">{user.email}</dd></div>
            </dl>
          </div>
        </div>
        <div className="actionButtons">
          <Link href="/" className="cancelBtn">Cancel</Link>
          <button onClick={handleConfirmBooking} disabled={isSubmitting} className={`confirmBtn ${isSubmitting ? "confirmBtnDisabled" : ""}`}>
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}