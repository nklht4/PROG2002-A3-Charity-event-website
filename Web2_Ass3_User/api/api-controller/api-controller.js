const dbCon = require("../db/database");
const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');

// A2 Routes

/**
 * GET: Obtain all categories.
 */
router.get('/categories', async (req, res) => {
    try {
        const connection = dbCon.getConnection();
        const [records] = await connection.promise().query('SELECT * FROM categories ORDER BY CategoryName');
        res.json(records);
        connection.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

/**
 * GET: Get a list of all active events with optional filtering.
 */
router.get('/events', async (req, res) => {
    try {
        const connection = dbCon.getConnection();
        let { date, location, category, q } = req.query;

        let sql = `
            SELECT e.*, c.CategoryName 
            FROM events e 
            JOIN categories c ON e.CategoryID = c.CategoryID 
            WHERE e.CurrentStatus = 1`;

        let params = [];
        if (q) {
            sql += ' AND (e.EventName LIKE ? OR e.Description LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }
        if (date) {
            sql += ' AND e.EventDate = ?';
            params.push(date);
        }
        if (location) {
            sql += ' AND e.Location LIKE ?';
            params.push(`%${location}%`);
        }
        if (category && category.length > 0) {
            sql += ' AND c.CategoryName IN (?)';
            params.push(category);
        }
        sql += ' ORDER BY e.EventDate ASC';

        const [records] = await connection.promise().query(sql, params);
        res.json(records);
        connection.end();
    } catch (err) {
        console.error("Error while retrieving data:", err);
        res.status(500).json({ error: 'Server Error' });
    }
});

/**
 * GET: Get a list of all state events with optional filtering(Admin)
 */
router.get('/allEvents', async (req, res) => {
    try {
        const connection = dbCon.getConnection();
        let { date, location, category, q } = req.query;

        let sql = `
            SELECT e.*, c.CategoryName 
            FROM events e 
            JOIN categories c ON e.CategoryID = c.CategoryID`;

        let params = [];
        if (q) {
            sql += ' AND (e.EventName LIKE ? OR e.Description LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }
        if (date) {
            sql += ' AND e.EventDate = ?';
            params.push(date);
        }
        if (location) {
            sql += ' AND e.Location LIKE ?';
            params.push(`%${location}%`);
        }
        if (category && category.length > 0) {
            sql += ' AND c.CategoryName IN (?)';
            params.push(category);
        }
        sql += ' ORDER BY e.EventDate ASC';

        const [records] = await connection.promise().query(sql, params);
        res.json(records);
        connection.end();
    } catch (err) {
        console.error("Error while retrieving data:", err);
        res.status(500).json({ error: 'Server Error' });
    }
});

//A3 Routes

/**
 * GET: Retrieve details for a single event AND all its registrations. 
 */
router.get('/events/:id', async (req, res) => {
    try {
        const connection = dbCon.getConnection();
        const eventId = req.params.id;

        const eventSql = `
            SELECT e.*, c.CategoryName 
            FROM events e 
            JOIN categories c ON e.CategoryID = c.CategoryID 
            WHERE e.EventID = ?`;
        const [eventResult] = await connection.promise().query(eventSql, [eventId]);

        if (eventResult.length === 0) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        const registrationsSql = `
            SELECT * FROM registrations 
            WHERE EventID = ? 
            ORDER BY RegistrationDate DESC`;
        const [registrationsResult] = await connection.promise().query(registrationsSql, [eventId]);

        const responseData = {
            eventDetails: eventResult[0],
            registrations: registrationsResult
        };
        res.json(responseData);
        connection.end();

    } catch (err) {
        console.error("Error while retrieving data:", err);
        res.status(500).json({ error: 'Server Error' });
    }
});

/**
 * POST: Insert a new registration for an event.
 */
router.post('/registrations', async (req, res) => {
    let connection;
    try {
        connection = dbCon.getConnection();
        const { EventID, UserName, ContactEmail, NumberOfTickets } = req.body;

        if (!EventID || !UserName || !ContactEmail || !NumberOfTickets) {
            return res.status(400).json({ error: 'Missing required fields for registration.' });
        }

        await connection.promise().query('START TRANSACTION');

        const eventSql = 'SELECT CurrentAttendees, GoalAttendees FROM events WHERE EventID = ?';
        const [eventResult] = await connection.promise().query(eventSql, [EventID]);

        if (eventResult.length === 0) {
            await connection.promise().query('ROLLBACK');
            return res.status(404).json({ error: 'Event not found.' });
        }

        const currentAttendees = eventResult[0].CurrentAttendees;
        const goalAttendees = eventResult[0].GoalAttendees;
        const newTotal = currentAttendees + NumberOfTickets;

        if (newTotal > goalAttendees) {
            await connection.promise().query('ROLLBACK');
            const remainingSpots = goalAttendees - currentAttendees;
            return res.status(400).json({
                error: `Cannot register ${NumberOfTickets} tickets. Only ${remainingSpots} spots remaining.`
            });
        }

        const insertSql = 'INSERT INTO registrations (EventID, UserName, ContactEmail, NumberOfTickets) VALUES (?, ?, ?, ?)';
        const insertParams = [EventID, UserName, ContactEmail, NumberOfTickets];

        await connection.promise().query(insertSql, insertParams);

        const updateSql = 'UPDATE events SET CurrentAttendees = CurrentAttendees + ? WHERE EventID = ?';
        const updateParams = [NumberOfTickets, EventID];

        await connection.promise().query(updateSql, updateParams);

        await connection.promise().query('COMMIT');

        res.status(201).json({
            msg: 'Registration successful!',
            remainingSpots: goalAttendees - newTotal
        });

    } catch (err) {
        if (connection) {
            await connection.promise().query('ROLLBACK');
        }
        console.error("Error while inserting registration:", err);
        res.status(500).json({ error: 'Server Error' });
    } finally {
        if (connection) connection.end();
    }
});


/**
 * POST: Insert a new charity event (for Admin Website). 
 */
router.post('/events', async (req, res) => {
    try {
        const connection = dbCon.getConnection();
        const { EventName, EventImage, EventDate, Location, Description, TicketPrice, GoalAttendees, CategoryID, CurrentStatus } = req.body;

        if (!EventName || !EventDate || !Location || !GoalAttendees || !CategoryID) {
            return res.status(400).json({ error: 'Missing required fields for creating an event.' });
        }

        if (CurrentStatus === undefined || (CurrentStatus != 0 && CurrentStatus != 1)) {
            return res.status(400).json({ error: 'Invalid value for CurrentStatus. Must be 0 or 1.' })
        }

        if (TicketPrice < 0) {
            return res.status(400).json({ error: 'Ticket price cannot be negative.' });
        }
        if (GoalAttendees < 1) {
            return res.status(400).json({ error: 'Goal attendees must be at least 1.' });
        }
        // Format the date to 'YYYY-MM-DD'
        const formattedDate = new Date(EventDate).toISOString().split('T')[0];

        const sql = 'INSERT INTO events (EventName, EventImage, EventDate, Location, Description, TicketPrice, GoalAttendees, CategoryID, CurrentStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [EventName, EventImage, formattedDate, Location, Description, TicketPrice, GoalAttendees, CategoryID, CurrentStatus];

        const [result] = await connection.promise().query(sql, params);

        res.status(201).json({ msg: 'Event created successfully!', newEventId: result.insertId });
        connection.end();

    } catch (err) {
        console.error("Error while inserting event:", err);
        res.status(500).json({ error: 'Server Error' });
    }
});


/**
 * PUT: Update an existing charity event (for Admin Website). 
 */
router.put('/events/:id', async (req, res) => {
    try {
        const connection = dbCon.getConnection();
        const eventId = req.params.id;
        const { EventName, EventImage, EventDate, Location, Description, TicketPrice, GoalAttendees, CategoryID, CurrentStatus } = req.body;

        if (!EventName || !EventDate || !Location || !GoalAttendees || !CategoryID) {
            return res.status(400).json({ error: 'Missing required fields for updating an event.' });
        }

        if (CurrentStatus === undefined || (CurrentStatus != 0 && CurrentStatus != 1)) {
            return res.status(400).json({ error: 'Invalid value for CurrentStatus. Must be 0 or 1.' });
        }

        if (TicketPrice < 0) {
            return res.status(400).json({ error: 'Ticket price cannot be negative.' });
        }
        if (GoalAttendees < 1) {
            return res.status(400).json({ error: 'Goal attendees must be at least 1.' });
        }

        // Format the date to 'YYYY-MM-DD'
        const formattedDate = new Date(EventDate).toISOString().split('T')[0];

        const sql = 'UPDATE events SET EventName = ?, EventImage = ?, EventDate = ?, Location = ?, Description = ?, TicketPrice = ?, GoalAttendees = ?, CategoryID = ?, CurrentStatus = ? WHERE EventID = ?';
        const params = [EventName, EventImage, formattedDate, Location, Description, TicketPrice, GoalAttendees, CategoryID, CurrentStatus, eventId];

        const [result] = await connection.promise().query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        res.json({ msg: 'Event updated successfully!' });
        connection.end();

    } catch (err) {
        console.error("Error while updating event:", err);
        res.status(500).json({ error: 'Server Error' });
    }
});


/**
 * DELETE: Remove an event only if it has no registrations (for Admin Website). 
 */
router.delete('/events/:id', async (req, res) => {
    let connection;
    try {
        connection = dbCon.getConnection();
        const eventId = req.params.id;

        const checkSql = 'SELECT COUNT(*) AS registrationCount FROM registrations WHERE EventID = ?';
        const [rows] = await connection.promise().query(checkSql, [eventId]);
        const registrationCount = rows[0].registrationCount;

        if (registrationCount > 0) {
            return res.status(400).json({ error: `Cannot delete event because it has ${registrationCount} existing registration(s).` });
        }

        const deleteSql = 'DELETE FROM events WHERE EventID = ?';
        const [result] = await connection.promise().query(deleteSql, [eventId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        res.json({ msg: 'Event deleted successfully!' });

    } catch (err) {
        console.error("Error while deleting event:", err);
        res.status(500).json({ error: 'Server Error' });
    } finally {
        if (connection) connection.end();
    }
});


/**
 * GET: Obtain a summary of the data from the database(Admin)
 */
router.get('/summary', async (req, res) => {
    try {
        const connection = dbCon.getConnection();

        const revenueSql = 'SELECT SUM(TicketPrice * CurrentAttendees) AS totalRevenue FROM events WHERE CurrentStatus = 1';
        const categorySql = `
            SELECT c.CategoryName, COUNT(e.EventID) AS eventCount
            FROM categories c
            LEFT JOIN events e ON c.CategoryID = e.CategoryID AND e.CurrentStatus = 1
            GROUP BY c.CategoryName
            ORDER BY eventCount DESC`;

        const [
            [revenueResult],
            [categoryResult]
        ] = await Promise.all([
            connection.promise().query(revenueSql),
            connection.promise().query(categorySql)
        ]);

        const summary = {
            totalRevenue: revenueResult[0].totalRevenue || 0,
            eventsByCategory: categoryResult
        };

        res.json(summary);
        connection.end();

    } catch (err) {
        console.error("Error fetching summary data:", err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Upload image route(to be modified before deploy)
router.post('/upload', upload.single('eventImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const fileUrl = '/images/' + req.file.filename;
    res.json({ filePath: fileUrl });
});

/**
 * POST: Receive and store the users' contact messages
 */
router.post('/contacts', async (req, res) => {
    try {
        const connection = dbCon.getConnection();
        const { UserName, ContactEmail, FeedBack } = req.body;

        if (!UserName || !ContactEmail || !FeedBack) {
            return res.status(400).json({ error: 'Name, Email, and FeedBack are required fields.' });
        }

        const sql = 'INSERT INTO contact (UserName, ContactEmail, FeedBack) VALUES (?, ?, ?)';
        const params = [UserName, ContactEmail, FeedBack];

        await connection.promise().query(sql, params);

        res.status(201).json({ msg: 'Thank you for your feedback!' });
        connection.end();

    } catch (err) {
        console.error("Error while inserting contact feedback:", err);
        res.status(500).json({ error: 'Server Error' });
    }
});


/**
 * GET: Obtain all the contact messages(Admin)
 */
router.get('/contacts', async (req, res) => {
    try {
        const connection = dbCon.getConnection();

        const sql = 'SELECT * FROM contact ORDER BY SubmissionDate DESC';

        const [records] = await connection.promise().query(sql);

        res.json(records);
        connection.end();

    } catch (err) {
        console.error("Error while fetching contact feedback:", err);
        res.status(500).json({ error: 'Server Error' });
    }
});

/**
 * DELETE: Delete the corresponding contact message based on the ID.
 */
router.delete('/contacts/:id', async (req, res) => {
    let connection;
    try {
        connection = dbCon.getConnection();
        const contactId = req.params.id;

        const sql = 'DELETE FROM contact WHERE ContactID = ?';
        const [result] = await connection.promise().query(sql, [contactId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Message not found.' });
        }

        res.json({ msg: 'Message deleted successfully!' });

    } catch (err) {
        console.error("Error while deleting contact message:", err);
        res.status(500).json({ error: 'Server Error' });
    } finally {
        if (connection) connection.end();
    }
});

module.exports = router;