const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rahul@123",
  database: "employee_portal"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
  } else {
    console.log("Database connected...");
  }
});

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});