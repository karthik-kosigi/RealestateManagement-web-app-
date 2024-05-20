const express = require('express');
const app = express();
const port = 8000;
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin', // Your MySQL username
  password: 'password', // Your MySQL password
  database: 'RealEstateManagementSystem' // Your database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Serve static files
const htmlPath = path.join(__dirname, "pages");
const publicPath = path.join(__dirname, "public");
app.use(express.static(htmlPath));
app.use(express.static(publicPath)); // Serve static files from the public folder
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies





app.get("/register", (req, res) => {
  res.sendFile(path.join(htmlPath, "register.html"));
});

app.get("", (req, res) => {
  res.sendFile(path.join(htmlPath, "homepage.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(htmlPath, "admin.html"));
});

app.get("/buyer", (req, res) => {
  res.sendFile(path.join(htmlPath, "buyer.html"));
});

// API Endpoint to fetch appointments for the logged-in buyer




app.get("/owner", (req, res) => {
  const ownerId = req.query.ownerId; // Retrieve ownerId from query parameter
  if (!ownerId) {
    res.status(400).send("Owner ID is required");
    return;
  }

  // Fetch owner-specific data from the database based on ownerId
  let userData = [];
  let propertiesData = [];

  // Fetch user data
  connection.query(`SELECT * FROM User WHERE userID = ${ownerId}`, (err, userResults) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send("Internal server error");
      return;
    }
    userData = userResults;

    // Fetch properties data
    connection.query(`SELECT * FROM Property WHERE OwnerID = ${ownerId}`, (err, propertyResults) => {
      if (err) {
        console.error('Error fetching properties data:', err);
        res.status(500).send("Internal server error");
        return;
      }
      propertiesData = propertyResults;

      // Send the owner page with the fetched data
      res.sendFile(path.join(htmlPath, "owner.html"));
    });
  });
});

// Endpoint to handle data requests for different entities
app.get("/data", (req, res) => {
  const { entity } = req.query;
  let query = '';

  switch (entity) {
    case 'users':
      query = 'SELECT * FROM User';
      break;
    case 'properties':
      query = 'SELECT * FROM Property';
      break;
    case 'owners':
      query = 'SELECT * FROM Owner';
      break;
    case 'agents':
      query = 'SELECT * FROM Agent';
      break;
    case 'appointments':
      query = 'SELECT * FROM Appointment';
      break;
    case 'buyers':
      query = 'SELECT * FROM Buyer';
      break;
    case 'transactions':
      query = 'SELECT * FROM Transaction';
      break;
    default:
      res.status(400).json({ error: 'Invalid entity' });
      return;
  }

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json({ tableData: results });
  });
});


// Fetch owner-specific data from the database based on ownerId
app.get("/ownerdata", (req, res) => {
  const ownerId = req.query.ownerId;
  if (!ownerId) {
    res.status(400).json({ error: "Owner ID is required" });
    return;
  }

  let userData = {};
  let propertiesData = [];

  // Fetch user data
  connection.query(`SELECT * FROM User WHERE userID = ${ownerId}`, (err, userResults) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    userData = userResults[0];

    // Fetch properties data
    connection.query(`SELECT * FROM Property WHERE OwnerID = ${ownerId}`, (err, propertyResults) => {
      if (err) {
        console.error('Error fetching properties data:', err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      propertiesData = propertyResults;

      // Combine user and properties data and send as JSON
      const ownerData = { userData, propertiesData };
      res.json(ownerData);
    });
  });
});


// Endpoint to handle property deletion
app.delete("/deleteproperty", (req, res) => {
  const { propertyId } = req.body;
  if (!propertyId) {
    res.status(400).json({ error: "Property ID is required" });
    return;
  }

  // Delete property from the database
  const deleteQuery = `DELETE FROM Property WHERE PropertyID = ${propertyId}`;
  connection.query(deleteQuery, (err, result) => {
    if (err) {
      console.error('Error deleting property:', err);
      res.status(500).json({ error: 'Error deleting property' });
      return;
    }

    res.json({ message: 'Property deleted successfully' });
  });
});







app.post("/addproperty", (req, res) => {
  const { propertyType, address, size, price, status, ownerId, agentid } = req.body;

  // Insert property into the database
  const insertQuery = `INSERT INTO Property (PropertyType, location, Size, Price, Status, OwnerID,agentid) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
  connection.query(insertQuery, [propertyType, address, size, price, status, ownerId, agentid], (err, result) => {
    if (err) {
      console.error('Error adding property:', err);
      res.status(500).json({ error: 'Error adding property' });
      return;
    }

    res.json({ message: 'Property added successfully' });
  });
});
// Endpoint to handle deletion
app.delete("/delete", (req, res) => {
  const { entity, id } = req.query;
  let deleteQuery = '';

  switch (entity) {
    case 'User':
      deleteQuery = `DELETE FROM User WHERE UserID = ${id}`;
      break;
    case 'Property':
      deleteQuery = `DELETE FROM Property WHERE PropertyID = ${id}`;
      break;
    case 'Owner':
      deleteQuery = `DELETE FROM Owner WHERE OwnerID = ${id}`;
      break;
    case 'Agent':
      deleteQuery = `DELETE FROM Agent WHERE AgentID = ${id}`;
      break;
    case 'Appointment':
      deleteQuery = `DELETE FROM Appointment WHERE AppointmentID = ${id}`;
      break;
    case 'Buyer':
      deleteQuery = `DELETE FROM Buyer WHERE BuyerID = ${id}`;
      break;
    case 'Transaction':
      deleteQuery = `DELETE FROM Transaction WHERE TransactionID = ${id}`;
      break;
    default:
      res.status(400).json({ error: 'Invalid entity' });
      return;
  }

  connection.query(deleteQuery, (err, results) => {
    if (err) {
      console.error('Error executing delete query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json({ message: 'Row deleted successfully' });
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { username, password, loginType } = req.body;
  console.log(username, password, loginType);
  // Check login credentials and type
  // For simplicity, this is a basic check, you should hash passwords and handle securely
  if (loginType === 'owner') {
    connection.query(`SELECT * FROM user WHERE username = ? AND Password = ? and usertype= ?`, [username, password, loginType], (err, results) => {
      if (err) {
        console.error('Error executing login query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (results.length > 0) {
        // Redirect to owner page with ownerId
        const firstResult = results[0];
        // Now you can access UserID from firstResult
        const ownerId = firstResult.UserID;

        console.log(results[0].UserId)
        console.log("userId: ", ownerId)
        res.redirect(`/owner?ownerId=${ownerId}`);
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  } else if (loginType === 'buyer') {
    connection.query(`SELECT * FROM user WHERE username = ? AND Password = ? and usertype= ?`, [username, password, loginType], (err, results) => {
      if (err) {
        console.error('Error executing login query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (results.length > 0) {
        // Redirect to owner page with ownerId
        const firstResult = results[0];
        // Now you can access UserID from firstResult
        const buyerId = firstResult.UserID;

        console.log(results[0].UserId)
        console.log("userId: ", buyerId)
        res.redirect(`/buyer?buyerId=${buyerId}`);
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  }


  else {
    res.status(400).json({ error: 'Invalid login type' });
  }
});

// Endpoint to get row counts for each table
app.get("/rowcounts", (req, res) => {
  connection.query('SELECT * FROM rowcounts', (err, results) => {
    if (err) {
      console.error('Error fetching row counts:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Format the results as an object with TableName as keys
    let rowCountData = {};
    results.forEach(row => {
      rowCountData[row.TableName] = row.RowCount;
    });

    res.json(rowCountData); // Send the row counts back as JSON
    console.log(rowCountData)
  });
});



app.get('/api/properties', (req, res) => {
  const query = 'SELECT * FROM Property';
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// API Endpoint to Book Appointment
app.post('/api/book-appointment', (req, res) => {
  const { propertyId, date, agentId, buyerId } = req.body;
  const query = 'INSERT INTO Appointment (AgentID, BuyerID, PropertyID, AppointmentDate, Status) VALUES (?, ?, ?, ?, ?)';
  // For demonstration purposes, assume AgentID and BuyerID are known
  const status = 'Pending';

  connection.query(query, [agentId, buyerId, propertyId, date, status], (error, result) => {
    if (error) throw error;
    const newAppointmentId = result.insertId;
    res.json({ message: 'Appointment booked successfully', appointmentId: newAppointmentId });
  });
});

app.get("/api/my-appointments", (req, res) => {
  const buyerId = req.query; // Assuming buyerId is in the session
  if (!buyerId) {
    res.status(400).json({ error: 'BuyerId not found in session' });
    return;
  }
  const query = 'SELECT * FROM Appointment WHERE BuyerID = ?';
  connection.query(query, [buyerId.buyerId], (error, results) => {
    if (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('BuyerID:', buyerId.buyerId);
    console.log('Appointments:', results);
    res.json(results);
  });

});








// Check if username exists
// Check if username exists and register user
app.post("/api/check-username", (req, res) => {
  const { username, phone, password, memberType } = req.body;

  // Check if username already exists
  const checkQuery = 'SELECT COUNT(*) AS count FROM user WHERE username = ?';
  connection.query(checkQuery, [username], (error, results) => {
    if (error) {
      console.error("Error checking username:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    const count = results[0].count;

    if (count > 0) {
      // Username already exists
      return res.json({ exists: true, message: "Username already exists. Please choose a different username." });
    } else {
      // Username does not exist, proceed with registration

      const registerQuery = 'INSERT INTO user (username, password, usertype) VALUES (?, ?, ?)';
      connection.query(registerQuery, [username, password, memberType], (error, results) => {
        if (error) {
          console.error("Error registering user:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
        return res.json({ exists: false, message: "User registered successfully" });
      });
    }
  });
});















// Start the server
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
