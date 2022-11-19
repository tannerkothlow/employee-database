const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config({ path: '../.env' });

// View all departments (polymorph to send back an array)
// View all roles (polymorph to send back an array)
// View all employees (polymorph to send back an array, polymorph to filter ONLY managers)
// Add a department
// Add a role
// Add an employee
// Update and employee role

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connect to the bigstore_db database.`)
);

class DBFunc {
    allDepartments(returnArray) {
        db.query('SELECT * FROM department', function (err, results) {
            if (err) {
                console.log(err);
            }
            // If called for the addRole() func in inquirer.js
            if (returnArray) {
                let departments = [];
                for (let i = 0; i < results.length; i++) {
                    departments[i] = results[i].name;
                };
                return departments;
            } else {
                // Otherwise just print the results for `View all departments`
                console.table(results);
            };
          });
    };
}

const dbFunc = new DBFunc;
dbFunc.allDepartments(true);

module.exports = DBFunc;