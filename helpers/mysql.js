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
    async showAll(table, returnArray, managerCall) { 
        let sendBack = [];
        try {
            const results = await db.query(`SELECT * FROM ${table}`);
            const data = results[0];

            if (managerCall) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].manager_id == null) {
                        let manName = `${data[i].first_name} ${data[i].last_name}`
                        sendBack.push(manName);
                    }
                }
                return sendBack;
            } else if(returnArray) {
                let param;
                if (table == 'department') {param = 'name'
                } else if (table == 'role') {param = 'title'
                } else {param = 'first_name'};

                for (let i = 0; i < data.length; i++) {
                    sendBack[i] = data[i][param];
                        // Kind of gross that I can't just edit 'param' to do this but eh, it's only one more line.
                        if (table == 'employee') { sendBack[i] += ` ${data[i]['last_name']}` };
                };

                return sendBack;
            } else {
                return data;
            }
        } catch (error) {
            console.error(error)
        }
    }
    async addNew(newObj, param) {
        // Can probably be replaced with a switch statement if ever needs to be expanded.
        if (param == 'department') {
            const {newDepartment} = newObj;
            try {
                const results = await db.query(`INSERT INTO department (name) VALUES ('${newDepartment}')`)
                console.log(`New department ${newDepartment}`)
            } catch (error) {
                console.error(error)
            }

        } else if (param == 'role') {
            const {newRoleName, newRoleSalary, newRoleDep} = newObj;
            
            // Get the id of the department
            const getDepId = new Promise((resolve, reject) => {
                resolve(db.query(`SELECT id FROM department WHERE name = '${newRoleDep}'`))
            })
            // THEN once we have the department id we can insert into table
            getDepId.then((response) => { 
                // yeah ok 
                let depID = response[0][0].id
                const result = db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${newRoleName}', '${newRoleSalary}', '${depID}')`)
                console.log(`New role ${newRoleName} added!`);
            }) 

        } else if (param == 'employee') {
            const {newEmpFN, newEmpLN, newEmpRole, newEmpManager} = newObj;
            console.log(newEmpRole);
            
            // Get the ROLE ID
            const getRoleID = new Promise ((resolve, reject) => {
                resolve(db.query(`SELECT * FROM role WHERE title = '${newEmpRole}'`))
            })

            // Get the ID of the manager
            const getManagerID = new Promise((resolve, reject) => {

                const splitName = newEmpManager.split(" ");
                let manFN = splitName[0];
                let manLN = splitName[1];

                resolve(db.query(`SELECT id FROM employee WHERE first_name = '${manFN}' AND last_name = '${manLN}'`))
            })

            // THEN add the new employee to the table
            Promise.all([getRoleID, getManagerID]).then((response) => {
                // i love arrays
                let roleID = response[0][0][0].id;
                let managerID = response[1][0][0].id;

                const result = db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${newEmpFN}','${newEmpLN}','${roleID}','${managerID}')`)

                console.log(`New employee ${newEmpFN} ${newEmpLN} added!`)
            })
        } else {console.error(`Invalid param submitted!!`)}
    }
}

module.exports = DBFunc;

 