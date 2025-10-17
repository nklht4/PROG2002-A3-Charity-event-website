const dbCon = require("./database");

const connection = dbCon.getConnection();
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        throw err;
    }
    console.log("Connected to db");
    setupDatabase();
});

function setupDatabase() {
    console.log("Starting table setup...");

    // SQL for creating tables in order of dependency
    const sqlCreateCategories = `
        CREATE TABLE IF NOT EXISTS categories (
            CategoryID int(10) NOT NULL AUTO_INCREMENT,
            CategoryName varchar(100) NOT NULL,
            PRIMARY KEY (CategoryID),
            UNIQUE KEY CategoryName (CategoryName)
        )`;

    const sqlCreateUsers = `
        CREATE TABLE IF NOT EXISTS users (
            UserID int(10) NOT NULL AUTO_INCREMENT,
            Username varchar(255) NOT NULL,
            Email varchar(255) NOT NULL,
            PasswordHash varchar(255) NOT NULL,
            Role enum('user','organizer','admin') NOT NULL DEFAULT 'user',
            CreatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (UserID),
            UNIQUE KEY Email (Email)
        )`;

    const sqlCreateEvents = `
        CREATE TABLE IF NOT EXISTS events (
            EventID int(10) NOT NULL AUTO_INCREMENT,
            EventName varchar(255) NOT NULL,
            EventImage varchar(255) DEFAULT NULL,
            EventDate date NOT NULL,
            Location varchar(255) NOT NULL,
            Description text,
            TicketPrice decimal(8,2) DEFAULT '0.00',
            CurrentAttendees int(10) DEFAULT '0',
            GoalAttendees int(10) NOT NULL,
            CurrentStatus tinyint(1) DEFAULT '1',
            CategoryID int(10) DEFAULT NULL,
            OrganizerID int(10) DEFAULT NULL,
            PRIMARY KEY (EventID),
            KEY CategoryID (CategoryID),
            KEY OrganizerID (OrganizerID),
            CONSTRAINT events_ibfk_1 FOREIGN KEY (CategoryID) REFERENCES categories (CategoryID) ON DELETE SET NULL ON UPDATE CASCADE,
            CONSTRAINT events_ibfk_2 FOREIGN KEY (OrganizerID) REFERENCES users (UserID) ON DELETE SET NULL ON UPDATE CASCADE
        )`;

    const sqlCreateEventsUsers = `
        CREATE TABLE IF NOT EXISTS events_users (
            EventID int(10) NOT NULL,
            UserID int(10) NOT NULL,
            RegistrationDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (EventID, UserID),
            KEY UserID (UserID),
            CONSTRAINT events_users_ibfk_1 FOREIGN KEY (EventID) REFERENCES events (EventID) ON DELETE CASCADE,
            CONSTRAINT events_users_ibfk_2 FOREIGN KEY (UserID) REFERENCES users (UserID) ON DELETE CASCADE
        )`;

    // Execute table creation in a nested callback structure to ensure order
    connection.execute(sqlCreateCategories, (err) => {
        if (err) throw err;
        console.log("- Table 'categories' checked/created.");
        connection.execute(sqlCreateUsers, (err) => {
            if (err) throw err;
            console.log("- Table 'users' checked/created.");
            connection.execute(sqlCreateEvents, (err) => {
                if (err) throw err;
                console.log("- Table 'events' checked/created.");
                connection.execute(sqlCreateEventsUsers, (err) => {
                    if (err) throw err;
                    console.log("- Table 'events_users' checked/created.");
                    console.log("All tables are set up. Starting data insertion...");
                    insertData();
                });
            });
        });
    });
}

function insertData() {
    // Using INSERT IGNORE to prevent errors on reruns
    const sqlInsert = [
        // Categories
        "INSERT IGNORE INTO `categories` (CategoryName) VALUES ('Gala Dinner'), ('Fun Run'), ('Silent Auction'), ('Concert'), ('Workshop'), ('Sports Tournament'), ('Art Exhibition'), ('Food Festival');",
        // Users
        "INSERT IGNORE INTO `users` (Username, Email, PasswordHash, Role) VALUES ('AdminUser', 'admin@charity.com', 'admin_password_hash', 'admin'), ('OrgA', 'orga@charity.com', 'orga_password_hash', 'organizer'), ('OrgB', 'orgb@charity.com', 'orgb_password_hash', 'organizer'), ('John Doe', 'john.doe@email.com', 'user_password_hash_1', 'user'), ('Jane Smith', 'jane.smith@email.com', 'user_password_hash_2', 'user');",
        // Events
        "INSERT IGNORE INTO `events` (EventName, EventImage, EventDate, Location, Description, TicketPrice, CurrentAttendees, GoalAttendees, CurrentStatus, CategoryID, OrganizerID) VALUES ('Annual Charity Gala 2025', '../img/event_img/1.jpg', '2025-11-15', 'Sydney Opera House', 'Join us for an elegant evening of dining and entertainment to support children education.', 150.00, 45, 200, 1, 1, 2), ('Sunrise Fun Run', '../img/event_img/2.jpg', '2025-10-20', 'Melbourne Park', 'Start your day with a refreshing 5km run to raise funds for cancer research.', 25.00, 120, 300, 1, 2, 3), ('Art for Hope Exhibition', '../img/event_img/3.jpg', '2025-12-05', 'Brisbane Art Gallery', 'Featuring local artists with all proceeds supporting mental health initiatives.', 0.00, 80, 150, 1, 7, 2), ('Gourmet Giving Festival', '../img/event_img/4.jpg', '2025-11-30', 'Adelaide Showground', 'Taste dishes from top chefs while supporting food security programs.', 45.00, 200, 400, 1, 8, 3), ('Tennis Charity Open', '../img/event_img/5.jpg', '2025-10-10', 'Perth Tennis Club', 'Amateur tennis tournament with all entry fees donated to youth sports programs.', 30.00, 60, 100, 1, 6, 2), ('Symphony of Hope', '../img/event_img/6.jpg', '2025-12-20', 'Melbourne Concert Hall', 'An evening of classical music to raise funds for medical research.', 75.00, 150, 250, 1, 4, 3), ('Silent Auction Extravaganza', '../img/event_img/7.jpg', '2025-11-25', 'Online Event', 'Bid on exclusive items and experiences from the comfort of your home.', 0.00, 95, 200, 1, 3, 2), ('Digital Skills Workshop', '../img/event_img/8.jpg', '2025-10-15', 'Sydney Tech Hub', 'Learn essential digital skills while supporting tech education for underprivileged youth.', 20.00, 30, 80, 1, 5, 2), ('Community Coding Workshop', '../img/event_img/9.jpg', '2025-08-15', 'Canberra Innovation Hub', 'A hands-on workshop for aspiring developers to learn the basics of web development.', 25.00, 48, 50, 1, 5, 3), ('Riverfront Music Fest', '../img/event_img/10.jpg', '2025-10-04', 'Brisbane Riverstage', 'An outdoor concert featuring the best local bands. All proceeds will benefit musicians in need.', 55.00, 275, 1000, 1, 4, 3), ('Charity Volleyball Match', '../img/event_img/11.jpg', '2025-09-05', 'Gold Coast Beach', 'Watch local celebrities and athletes compete in a friendly beach volleyball tournament.', 15.00, 115, 120, 1, 6, 2), ('Starlight Gala Dinner', '../img/event_img/12.jpg', '2025-11-22', 'Crown Towers, Melbourne', 'Our most prestigious event of the year. A night of fine dining and auctions to fund our Starlight Children Program.', 250.00, 88, 300, 1, 1, 2), ('Taste of Tasmania Charity Drive', '../img/event_img/13.jpg', '2025-12-28', 'Hobart Waterfront', 'A weekend-long food and wine festival showcasing local produce.', 10.00, 450, 2000, 1, 8, 3), ('Suspend Test Event', '../img/event_img/14.jpg', '2025-11-01', 'Suspend', 'This event has been postponed. Please check back later for a new date.', 0.00, 10, 150, 0, 3, 2), ('City to Bay Fun Run 2026', '../img/event_img/15.jpg', '2026-03-15', 'Adelaide City Center', 'The annual city-to-bay run is back! Join thousands to raise money for health research foundations.', 40.00, 35, 1500, 1, 2, 3);",
        // Events-Users Registrations
        "INSERT IGNORE INTO `events_users` (EventID, UserID) VALUES (1, 4), (1, 5), (2, 4), (5, 5);"
    ];

    let completed = 0;

    sqlInsert.forEach((query) => {
        connection.execute(query, (err) => {
            if (err) {
                // Using INSERT IGNORE makes this check less critical, but it's good to keep
                console.log(`Warning during data insertion:`, err.message);
            }
            completed++;
            if (completed === sqlInsert.length) {
                console.log("All initial data has been processed.");
                closeConnection();
            }
        });
    });
}

function closeConnection() {
    connection.end((err) => {
        if (err) {
            console.log("Error closing the database connection:", err.message);
        } else {
            console.log("Database connection closed. Setup is complete.");
        }
    });
}