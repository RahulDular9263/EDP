const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rahul@123',
  database: 'employee_portal'
});

module.exports = db;
