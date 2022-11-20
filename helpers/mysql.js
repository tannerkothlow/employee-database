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
const conCaution = '\x1b[33m%s\x1b[0m';

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
                console.log(conGood, `\n +++ New department: ${newDepartment} added! +++`)
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
                console.log(conGood, `\n +++ New role: ${newRoleName} added! +++ `);
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

                console.log(conGood, `\n +++ New employee: ${newEmpFN} ${newEmpLN} added! +++`)
            })
        } else {console.error(conBad, `Invalid param submitted!!`)}
    }
    async updateEmp(emp, elem, param) {

        const splitName = emp.split(" ");
        let empFN = splitName[0];
        let empLN = splitName[1];

        let getParamID;
        let updateColumn;

        if(param == 'role') {
            updateColumn = `role_id`;
            getParamID = await db.query(`SELECT * FROM role WHERE title = '${elem}'`);
       
        } else if (param == 'manager') {

            const splitName = elem.split(" ");
            let manFN = splitName[0];
            let manLN = splitName[1];
            updateColumn = `manager_id`;

            getParamID = await db.query(`SELECT * FROM employee WHERE first_name = '${manFN}' AND last_name = '${manLN}'`);

        } else { console.error(conBad `\nInvalid param!`)};

        let paramID = getParamID[0][0].id;
        const update = await db.query(`UPDATE employee SET ${updateColumn} = ${paramID} WHERE first_name = '${empFN}' AND last_name = '${empLN}'`);
        console.log(conGood, `\n +++ Employee ${empFN} ${empLN}'s ${param} updated to ID# ${paramID}. +++`);
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
            return sendBack;

        } catch (error) {
            console.error(error)
        }
    }
    async deleteElement(table, element) {
        console.log(conCaution, `${table} table to have ${element} deleted`);
        // department name
        // role title
        // employee first_name + last_name
    }
    async viewSalaries(department) {

        const getDepartment = await db.query(`SELECT * FROM department WHERE name = '${department}'`);
        
        const depID = getDepartment[0][0].id;

        // Gets the ID of all roles that are in the department
        const getRolesInDep = await db.query(`SELECT id, salary FROM role WHERE department_id = ${depID}`)

        const relRoles = getRolesInDep[0];

        // Error handling - No roles
        if (relRoles.length == 0) {
            console.log(conBad, `NO ROLES FOUND IN DEPARTMENT`);
            return `Add roles to this department first!`;
        };

        // For loop to prepare a statement that selects ALL employess with a role id.
        let param = "";
        for (let i = 0; i < relRoles.length; i++) {
            param += ` role_id = ${relRoles[i].id}`
            if (i != relRoles.length - 1) {param += ` OR`}
        }

        const getEmpWithRoleID = await db.query(`SELECT * FROM employee WHERE ${param}`)
        const empInDep = getEmpWithRoleID[0];

        // Error handling - no employees in department
        if (empInDep.length == 0) {
            console.log(conBad, `NO EMPLOYEES FOUND IN DEPARTMENT`);
            return `Add employees to this department's roles first!`;
        };

        let salaryTotal = 0;

        for (let i = 0; i < empInDep.length; i++) {
            for (let x = 0; x < relRoles.length; x++) {
                if (empInDep[i].role_id == relRoles[x].id) {
                    salaryTotal = salaryTotal + Number(relRoles[x].salary);
                    // console.log(relRoles[x].salary);
                }
            }
        }
        return `\n For the ${getDepartment[0][0].name} department: \n\n Employee Count: ${empInDep.length} \n\n Combined Salary: $${salaryTotal} \n`
    }
}

module.exports = DBFunc;

 