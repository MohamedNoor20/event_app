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

export async function POST(request) {
  try {
    const user = getUserFromCookie(request);

    //Check if user is logged in
    if (!user) {
      return Response.json(
        { success: false, message: "You must be logged in to book an event." }, 
        { status: 401 }
      );
    }

    const { eventId } = await request.json();

    if (!eventId) {
      return Response.json(
        { success: false, message: "Event ID is required." }, 
        { status: 400 }
      );
    }

    //Check if the event exists and get its MaxSeat capacity
    const [events] = await pool.query('SELECT MaxSeat FROM EventTBL WHERE EventID = ?', [eventId]);
    
    if (events.length === 0) {
      return Response.json(
        { success: false, message: "Event not found." }, 
        { status: 404 }
      );
    }
    const maxSeats = events[0].MaxSeat;

    //Check if the user has already booked this exact event
    const [existingBookings] = await pool.query(
      'SELECT * FROM Book WHERE EventID = ? AND UserID = ?', 
      [eventId, user.UserID]
    );

    if (existingBookings.length > 0) {
      return Response.json(
        { success: false, message: "You have already booked a ticket for this event!" }, 
        { status: 409 }
      );
    }

    //Check if the event is fully booked
    if (maxSeats <= 0) {
      return Response.json(
        { success: false, message: "Sorry, this event is fully booked." }, 
        { status: 400 }
      );
    }

    //Insert the booking into the database
    await pool.query(
      'INSERT INTO Book (EventID, UserID) VALUES (?, ?)',
      [eventId, user.UserID]
    );

    //Decrease the available seats by 1
    await pool.query(
      'UPDATE EventTBL SET MaxSeat = MaxSeat - 1 WHERE EventID = ?',
      [eventId]
    );

    return Response.json({ 
      success: true, 
      message: "Successfully booked the event!" 
    });

  } catch (error) {
    console.error("Booking error:", error);
    return Response.json(
      { success: false, message: "Internal server error." }, 
      { status: 500 }
    );
  }
}