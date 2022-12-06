// need to run the following in the console for installations
// npm i console.table
// npm i inquirer@8.2.4
// npm install --save mysql2

// load dependencies
const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const Sequelize = require('sequelize');
require('dotenv').config();
require('console.table');

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3001
  }
);
console.log(`Connected to the employee_db database.`)





// todo: use this layout for console.table
const cTable = require('console.table');
console.table([
  {
    name: 'foo',
    age: 10
  }, {
    name: 'bar',
    age: 20
  }
]);

console.log(cTable);

// todo: write query, add, and delete functions here







// todo: fix this section
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

db.connect(function (err){
  if (err) throw err;
  console.log("connected as id " + db.threadId);
});

module.exports = connection






// exit employee-tracker 
function exit() {

  // terminate mySQL connection
  connection.end();

  // say good bye
  console.log("connection terminated");

};

