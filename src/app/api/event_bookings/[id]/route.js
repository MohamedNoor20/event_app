//get all bookings for a specific event
//created by: Afaq Ahmed

import pool from "@/lib/db";

//helper to get user from cookie
function getUserFromCookie(request) {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const cookies = {};
    cookieHeader.split('; ').forEach(cookie => {
        const [key, value] = cookie.split('=');
        cookies[key] = value;
    });

    if (cookies.session) {
        return {
            UserID: parseInt(cookies.session),
            Role: cookies.role
        };
    }
    return null;
}

//get all users who booked this event
export async function GET(request, { params }) {
    const { id } = await params;
    const user = getUserFromCookie(request);
    const eventId = id;

    //check if logged in
    if (!user) {
        return Response.json({ success: false, message: 'Login required' }, { status: 401 });
    }

    //check if event exists and get owner
    const [events] = await pool.query(
        'SELECT UserID FROM EventTBL WHERE EventID = ?',
        [eventId]
    );

    if (events.length === 0) {
        return Response.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    //check if user is owner or admin
    if (events[0].UserID !== user.UserID && user.Role !== 'admin') {
        return Response.json({ success: false, message: 'Access denied' }, { status: 403 });
    }

    //get all users who booked this event
    const [bookings] = await pool.query(
        `SELECT b.BookID, b.UserID, u.Username, u.Firstname, u.Lastname
         FROM Book b
         JOIN Users u ON b.UserID = u.UserID
         WHERE b.EventID = ?
         ORDER BY b.BookID DESC`,
        [eventId]
    );

    return Response.json({
        success: true,
        bookings: bookings,
        count: bookings.length
    });
}