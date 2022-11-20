const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config({ path: '../.env' });

// View all departments (polymorph to send back an array)
// View all roles (polymorph to send back an array)
// View all employees (polymorph to send back an array, polymorph to filter ONLY managers)
// Add a department
// Add a role
// Add an employee
// Update an employee role
// Update an employee's manager

const conGood = '\x1b[32m%s\x1b[0m';
const conBad = '\x1b[31m%s\x1b[0m';

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
            // Polymorph to send back JUST managers, an array of selections, or the raw data to be console.table'd
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
                // Param is set to the relevant "Name" key
                if (table == 'department') {param = 'name'
                } else if (table == 'role') {param = 'title'
                } else {param = 'first_name'};

                for (let i = 0; i < data.length; i++) {
                    sendBack[i] = data[i][param];
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
        // Polymorph to send the incoming data to one of three functions that inserts data into its respective table
        if (param == 'department') {
            const {newDepartment} = newObj;
            try {
                const results = await db.query(`INSERT INTO department (name) VALUES ('${newDepartment}')`)
                console.log(conGood, `\n +++ New department ${newDepartment} added! +++`)
            } catch (error) {
                console.error(conBad, `error`)
            }

        } else if (param == 'role') {
            const {newRoleName, newRoleSalary, newRoleDep} = newObj;
            
            // Get the id of the department
            const getDepId = new Promise((resolve, reject) => {
                resolve(db.query(`SELECT id FROM department WHERE name = '${newRoleDep}'`))
            })
            // THEN once we have the department id we can insert into table
            getDepId.then((response) => {
                let depID = response[0][0].id
                const result = db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${newRoleName}', '${newRoleSalary}', '${depID}')`)
                console.log(conGood, `\n +++ New role ${newRoleName} added! +++ `);
            }) 

        } else if (param == 'employee') {
            const {newEmpFN, newEmpLN, newEmpRole, newEmpManager} = newObj;
            // console.log(newEmpRole);
            
            // Get the ROLE ID
            const getRoleID = new Promise ((resolve, reject) => {
                resolve(db.query(`SELECT * FROM role WHERE title = '${newEmpRole}'`))
            })

            // Get the ID of the manager
            const getManagerID = new Promise((resolve, reject) => {
                // If the enetered employee is managed
                if (newEmpManager != 'None') {
                const splitName = newEmpManager.split(" ");
                let manFN = splitName[0];
                let manLN = splitName[1];

                resolve(db.query(`SELECT id FROM employee WHERE first_name = '${manFN}' AND last_name = '${manLN}'`))
                } else {
                    resolve('None');
                }
            })

            // THEN add the new employee to the table
            Promise.all([getRoleID, getManagerID]).then((response) => {
                let roleID = response[0][0][0].id;
                let managerID = (response[1] != 'None') ? response[1][0][0].id : 1;
                // TO SOLVE: cannot insert 'null' into table without app freezing. Will be entered as 0 for now
                // let managerID = (response[1] != 'None') ? response[1][0][0].id : null;

                const result = db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${newEmpFN}','${newEmpLN}','${roleID}','${managerID}')`)

                console.log(conGood, `\n +++ New employee ${newEmpFN} ${newEmpLN} added! +++`)
            })
        } else {console.error(conBad, `Invalid param submitted!!`)}
    }
    async updateEmp(emp, elem, param) {

        const splitName = emp.split(" ");
        let empFN = splitName[0];
        let empLN = splitName[1];

        let getParamID
        let updateColumn

        if(param == 'role') {
        getParamID = new Promise ((resolve, reject) => {
            updateColumn = `role_id`
            resolve(db.query(`SELECT * FROM role WHERE title = '${elem}'`))
            reject(`Invalid query!`)
        })
        } else if (param == 'manager') {

            const splitName = elem.split(" ");
            let manFN = splitName[0];
            let manLN = splitName[1];
            updateColumn = `manager_id`;

            getParamID = new Promise ((resolve, reject) => {
                resolve(db.query(`SELECT * FROM employee WHERE first_name = '${manFN}' AND last_name = '${manLN}'`))
                reject(`Invalid query!`)
            })

        } else { console.error(conBad `\nInvalid param!`)}

        getParamID.then((response) => {

            let paramID = response[0][0].id;

            const result = db.query(`UPDATE employee SET ${updateColumn} = ${paramID} WHERE first_name = '${empFN}' AND last_name = '${empLN}'`)

            console.log(conGood, `\n +++ Employee ${empFN} ${empLN}'s ${param} updated to ID# ${paramID}. +++`)
        })

       
    }
    async showEmpByManager(manager) {
        let sendBack;
        // Get manager's ID, then get all employees with that manager_id, then return
        const splitName = manager.split(" ");
        const manFN = splitName[0];
        const manLN = splitName[1];

        try {
            const getManager = await db.query(`SELECT * FROM employee WHERE first_name = '${manFN}' AND last_name = '${manLN}'`);
            const data = getManager[0]
            let managerID = data[0].id;

            const getEmployees = await db.query(`SELECT * FROM employee WHERE manager_id = ${managerID}`);

            sendBack = getEmployees[0];
            // console.table(sendBack);
            return sendBack;

        } catch (error) {
            console.error(error)
        }
        
        // const getManagerID = new Promise ((resolve, reject) => {
        //     resolve(db.query(`SELECT * FROM employee WHERE first_name = '${manFN}' AND last_name = '${manLN}'`))
        //     reject(`Invalid query!`)
        // });
        // getManagerID.then((response) => {
        //     let managerID = response[0][0].id;
        //     const getEmployees = new Promise((resolve, reject) => {
        //         resolve(db.query(`SELECT * FROM employee WHERE manager_id = ${managerID}`))
        //         reject(`Manager ID could not be found!`)
        //     });
        //     getEmployees.then((response) => {
        //         sendBack = response[0];
        //         console.log(sendBack)
        //         return sendBack;
        //     })
        // })
    }
}

module.exports = DBFunc;

 