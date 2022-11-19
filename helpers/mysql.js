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

const dbConfig = {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

const db = mysql.createConnection(
    dbConfig, 
    console.log(`Connected to ${dbConfig.database}`)
).promise();

class DBFunc {
    async showAll(table, returnArray) { 
        let sendBack;
        try {
            const results = await db.query(`SELECT * FROM ${table}`);
            sendBack = results[0];
            // console.log(results[0]);
        
        // const results = await db.query(`SELECT * FROM ${table}`, function (err, results) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     // If called for the addRole(), addEmployee(), or updateRole func in inquirer.js
        //     if (returnArray) {
        //         let sendBack = [];

        //         let param;
        //         if (table == 'department') { param = 'name';
        //         } else if (table == 'role') {param = 'title';
        //         } else {param = 'first_name'};

        //         for (let i = 0; i < results.length; i++) {
        //             sendBack[i] = results[i][param];
        //                 // Kind of gross that I can't just edit 'param' to do this but eh, it's only one more line.
        //                 if (table = 'employee') { sendBack[i] += ` ${results[i]['last_name']}` };
        //         };
        //         // thrownObject = sendBack;
        //     } else {
        //         // console.table(results);
        //         thrownObject = results;
        //         // console.log(thrownObject);
        //     };
        //     console.log(thrownObject);
        // });
        } catch (error) {
            console.error(error)
        }
        // console.log(sendBack);
        return sendBack;
    }
}

const dbFunc = new DBFunc;
// dbFunc.showAll('employee').then(console.log('Promise fufilled'));
// console.log('Fufilled 2')
// const grape = dbFunc.showAll('employee');
// console.log(grape);

const promise1 = new Promise((resolve, reject) => {
    resolve(dbFunc.showAll('employee'));
});

promise1.then((response) => {
    console.log(response);
    console.log('YAY!')
});

module.exports = DBFunc;