"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../style/globals.css";

export default function BookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // DEMO ONE
  const User = {
    firstName: "abc",
    lastName: "def",
    email: "abc123@gmail.com",
  };

  const Ticket = {
    id: "12234",
    eventName: "abcdef",
    date: "1/1/1111",
    time: "11:11",
    location: "abc",
    price: "123$",
    ticketType: "abc",
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call to the database
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
      
      // Redirect to homepage after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }, 1500);
  };

  if (bookingSuccess) {
    return (
      <div className="successContainer">
        <div className="successCard">
          <h2 className="successTitle">Booking Confirmed!</h2>
          <p className="successText">
            Thank you, {User.firstName}. Your ticket for <strong>{Ticket.eventName}</strong> has been successfully booked.
          </p>
          <p className="successSubtext">Redirecting you to the home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pageContainer">
      <div className="contentWrapper">
        
        {/* Header */}
        <div>
          <h1 className="headerTitle">Review Your Booking</h1>
          <p className="headerSubtitle">
            Please double-check your information and the event details before confirming.
          </p>
        </div>

        <div className="card">
          
          {/* Ticket Information Section */}
          <div className="sectionHeaderBlue">
            <h3 className="sectionTitleBlue">Ticket Information</h3>
          </div>
          <div>
            <dl className="dlList">
              <div className="dlRow">
                <dt className="dtLabel">Event</dt>
                <dd className="ddValue ddValueBold">
                  {Ticket.eventName}
                </dd>
              </div>
              <div className="dlRow">
                <dt className="dtLabel">Date & Time</dt>
                <dd className="ddValue">
                  {Ticket.date} at {Ticket.time}
                </dd>
              </div>
              <div className="dlRow">
                <dt className="dtLabel">Location</dt>
                <dd className="ddValue">
                  {Ticket.location}
                </dd>
              </div>
              <div className="dlRow">
                <dt className="dtLabel">Total Price</dt>
                <dd className="ddValue ddValuePrice">
                  {Ticket.price}
                </dd>
              </div>
            </dl>
          </div>

          {/* User Information Section */}
          <div className="sectionHeaderGray">
            <h3 className="sectionTitleGray">Your Details</h3>
          </div>
          <div>
            <dl className="dlList">
              <div className="dlRow">
                <dt className="dtLabel">Full name</dt>
                <dd className="ddValue">
                  {User.firstName} {User.lastName}
                </dd>
              </div>
              <div className="dlRow">
                <dt className="dtLabel">Email address</dt>
                <dd className="ddValue">
                  {User.email}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actionButtons">
          <Link href="/" className="cancelBtn">
            Cancel
          </Link>
          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className={`confirmBtn ${isSubmitting ? "confirmBtnDisabled" : ""}`}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </button>
        </div>

      </div>
    </div>
  );
}