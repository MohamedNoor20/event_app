import pool from "@/lib/db";


function getUserFromCookie(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = {};
  cookieHeader.split("; ").forEach(cookie => {
    const [key, ...value] = cookie.split("=");
    cookies[key] = value.join("=");
  });

  if (cookies.session) {
    return {
      UserID: parseInt(cookies.session),
      Role: cookies.role
    };
  }
  return null;
}

//Fetch all bookings for the logged-in user (For the Home Page)
export async function GET(request) {
  const user = getUserFromCookie(request);

  if (!user) {
    return Response.json({ success: false, message: "Login required" }, { status: 401 });
  }

  try {
    const [bookings] = await pool.query(`
      SELECT b.BookID, e.EventID, e.Title, e.Date, e.Location, e.Amount 
      FROM Book b
      JOIN EventTBL e ON b.EventID = e.EventID
      WHERE b.UserID = ?
      ORDER BY e.Date ASC
    `, [user.UserID]);

    return Response.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return Response.json({ success: false, message: "Failed to fetch bookings" }, { status: 500 });
  }
}

//Create a new booking
export async function POST(request) {
  try {
    const user = getUserFromCookie(request);

    if (!user) {
      return Response.json({ success: false, message: "You must be logged in to book an event." }, { status: 401 });
    }

    const { eventId } = await request.json();

    if (!eventId) {
      return Response.json({ success: false, message: "Event ID is required." }, { status: 400 });
    }

    const [events] = await pool.query('SELECT MaxSeat FROM EventTBL WHERE EventID = ?', [eventId]);
    
    if (events.length === 0) {
      return Response.json({ success: false, message: "Event not found." }, { status: 404 });
    }
    const maxSeats = events[0].MaxSeat;

    const [existingBookings] = await pool.query('SELECT * FROM Book WHERE EventID = ? AND UserID = ?', [eventId, user.UserID]);

    if (existingBookings.length > 0) {
      return Response.json({ success: false, message: "You have already booked a ticket for this event!" }, { status: 409 });
    }

    if (maxSeats <= 0) {
      return Response.json({ success: false, message: "Sorry, this event is fully booked." }, { status: 400 });
    }

    await pool.query('INSERT INTO Book (EventID, UserID) VALUES (?, ?)', [eventId, user.UserID]);
    await pool.query('UPDATE EventTBL SET MaxSeat = MaxSeat - 1 WHERE EventID = ?', [eventId]);

    return Response.json({ success: true, message: "Successfully booked the event!" });

  } catch (error) {
    console.error("Booking error:", error);
    return Response.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

//Cancel a booking
export async function DELETE(request) {
  const user = getUserFromCookie(request);
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');

  if (!user) {
    return Response.json({ success: false, message: "Login required" }, { status: 401 });
  }

  if (!bookId) {
    return Response.json({ success: false, message: "Booking ID required" }, { status: 400 });
  }

  try {
    const [bookingDetails] = await pool.query('SELECT EventID FROM Book WHERE BookID = ? AND UserID = ?', [bookId, user.UserID]);

    if (bookingDetails.length === 0) {
      return Response.json({ success: false, message: "Booking not found or unauthorized" }, { status: 404 });
    }

    const eventId = bookingDetails[0].EventID;

    //Delete the booking & restore the seat capacity
    await pool.query('DELETE FROM Book WHERE BookID = ?', [bookId]);
    await pool.query('UPDATE EventTBL SET MaxSeat = MaxSeat + 1 WHERE EventID = ?', [eventId]);

    return Response.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return Response.json({ success: false, message: "Failed to cancel booking" }, { status: 500 });
  }
}