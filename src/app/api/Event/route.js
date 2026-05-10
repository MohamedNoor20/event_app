//events API it handles create, read, update, and delete for events
//created by: Afaq Ahmed

import pool from "@/lib/db";

//helper function to get logged in user from browser cookie
function getUserFromCookie(request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [key, ...value] = cookie.split("=");
      return [key, value.join("=")];
    })
  );

  if (cookies.session) {
    return {
      UserID: parseInt(cookies.session),
      Role: cookies.role
    };
  }
  return null;
}

//show all public events
export async function GET(request) {

  //check if asking for single event by ID
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {

    const [events] = await pool.query(
      `SELECT e.*, u.Username 
       FROM EventTBL e
       JOIN Users u ON e.UserID = u.UserID
       WHERE e.EventID = ?`,
      [id]
    );

    return Response.json({
      success: true,
      event: events[0]
    });
  }

  // EVERYONE can see all upcoming events
  const [events] = await pool.query(`
      SELECT e.*, u.Username
      FROM EventTBL e
      JOIN Users u ON e.UserID = u.UserID
      WHERE e.Date >= CURDATE()
      ORDER BY e.Date ASC
  `);

  return Response.json({
    success: true,
    events
  });
}

//create new event only for organizer and admin
export async function POST(request) {
  const user = getUserFromCookie(request);

  //check if user is logged in
  if (!user) {
    return Response.json({ success: false, message: 'Login required' }, { status: 401 });
  }

  //check if user has permission of organizer or admin
  if (user.Role !== 'organiser' && user.Role !== 'admin') {
    return Response.json({ success: false, message: 'Only organisers can create events' }, { status: 403 });
  }

  const { title, description, category, location, date, maxSeat, amount } = await request.json();

  //validate the data
  if (!title || title.length < 3) {
    return Response.json({ success: false, message: 'Title must be at least 3 characters' }, { status: 400 });
  }

  if (!date || new Date(date) < new Date()) {
    return Response.json({ success: false, message: 'Date cannot be in the past' }, { status: 400 });
  }
  
  // Safely parse numbers
  const parsedAmount = parseFloat(amount) || 0;
  const parsedMaxSeat = parseInt(maxSeat) || 10;
  
  // Prevent numbers that are too large for the database
  if (parsedAmount > 9999.99) {
    return Response.json({ success: false, message: 'Amount cannot exceed €9,999.99' }, { status: 400 });
  }

  //save to database
  const [result] = await pool.query(
    `INSERT INTO EventTBL (UserID, Title, Description, Category, Location, Date, MaxSeat, Amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [user.UserID, title, description, category, location, date, parsedMaxSeat, parsedAmount]
  );

  return Response.json({ success: true, message: 'Event created!', eventId: result.insertId });
}

//Update existing event only for the owner
export async function PUT(request) {
  const user = getUserFromCookie(request);

  if (!user) {
    return Response.json({ success: false, message: 'Login required' }, { status: 401 });
  }

  const { eventId, title, description, category, location, date, maxSeat, amount } = await request.json();

  //check if event exists
  const [events] = await pool.query('SELECT * FROM EventTBL WHERE EventID = ?', [eventId]);

  if (events.length === 0) {
    return Response.json({ success: false, message: 'Event not found' }, { status: 404 });
  }

  //check if user owns this event or is admin
  if (events[0].UserID !== user.UserID && user.Role !== 'admin') {
    return Response.json({ success: false, message: 'You can only edit your own events' }, { status: 403 });
  }

  // Safely parse numbers
  const parsedAmount = parseFloat(amount) || 0;
  const parsedMaxSeat = parseInt(maxSeat) || 10;

  if (parsedAmount > 9999.99) {
    return Response.json({ success: false, message: 'Amount cannot exceed €9,999.99' }, { status: 400 });
  }

  //update the event
  await pool.query(
    `UPDATE EventTBL SET Title=?, Description=?, Category=?, Location=?, Date=?, MaxSeat=?, Amount=?
         WHERE EventID = ?`,
    [title, description, category, location, date, parsedMaxSeat, parsedAmount, eventId]
  );

  return Response.json({ success: true, message: 'Event updated!' });
}

//remove event only for owner
export async function DELETE(request) {
  const user = getUserFromCookie(request);
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('id');

  if (!user) {
    return Response.json({ success: false, message: 'Login required' }, { status: 401 });
  }

  //check if event exists
  const [events] = await pool.query('SELECT * FROM EventTBL WHERE EventID = ?', [eventId]);

  if (events.length === 0) {
    return Response.json({ success: false, message: 'Event not found' }, { status: 404 });
  }

  //check if user owns this event
  if (events[0].UserID !== user.UserID && user.Role !== 'admin') {
    return Response.json({ success: false, message: 'You can only delete your own events' }, { status: 403 });
  }

  //delete from database
  await pool.query('DELETE FROM EventTBL WHERE EventID = ?', [eventId]);

  return Response.json({ success: true, message: 'Event deleted!' });
}