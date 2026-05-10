// Home Page
'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 20px',
      textAlign: 'center'
    }}>
      {/* Main Title */}
      <h1 style={{
        fontSize: '3rem',
        color: 'white',
        marginBottom: '16px',
        fontWeight: '600'
      }}>
        EventHub
      </h1>

      <p style={{
        fontSize: '1.2rem',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: '40px',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        Discover and book tickets for amazing events
      </p>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Link href="/Event">
          <button style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '40px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Browse Events
          </button>
        </Link>

        <Link href="/Create_event">
          <button style={{
            backgroundColor: 'transparent',
            color: 'white',
            padding: '12px 32px',
            border: '1px solid white',
            borderRadius: '40px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Host an Event
          </button>
        </Link>
      </div>

      {/* Simple Footer Text */}
      <p style={{
        marginTop: '80px',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.8rem'
      }}>
        Find your next experience
      </p>
    </div>
  );
}