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

            if(returnArray) {
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
            } catch (error) {
                console.error(error)
            }

        } else if (param == 'role') {
            const {newRoleName, newRoleSalary, newRoleDep} = newObj;
            let depID;
            // Get department ID
            try {
                const depIDpull = await db.query(`SELECT * FROM department WHERE name = '${newRoleDep}'`)
                depID = depIDpull[0].id;
            } catch (error) {
                console.error(error)
            }
            // Write role to file
            // try {
            //     const results = await db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${newRoleName}', '${newRoleSalary}', '${depID}')`)
            // } catch (error) {
            //     console.error(error)
            // }

        } else if (param == 'employee') {
            const {newEmpFN, newEmpLN, newEmpRole, newEmpmanager} = newObj;
            console.log(newObj);

        } else {console.error(`Invalid param submitted!!`)}
    }
}

const dbfunc = new DBFunc;
dbfunc.addNew(true, 'role');

getDepId = dep => {
    db.query(`SELECT * FROM `)
}

module.exports = DBFunc;

 