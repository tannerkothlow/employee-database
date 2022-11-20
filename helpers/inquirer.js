// Contains the inqruier prompts and paths, exports to index.js
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const DBFunc = require('./mysql');

const dbFunc = new DBFunc;

const conTabCol = '\x1b[34m%s\1xb[0m';

// BONUS:

// Update employee managers
// View employees by manager
// View employees by department
// Delete departments, roles, and employees
// View salary total of all employees in a department

class Prompts {
    init() {
        inquirer
        .prompt([
            {
                type: 'list',
                choices: [`View all departments`,
                `View all roles`,
                `View all employees`,
                `Add a department`,
                `Add a role`,
                `Add an employee`,
                `Update an employee role`,
                // ==== BONUS PROMPTS, EXPIREMENTAL ====
                `Update an employee's manager`,
                `View employees by manager`,
                `Remove department, role, or employee`,
                `View salary budgets per department`
                ],
                pageSize: 5,
                loop: false,
                message: `What would you like to do?`,
                name: `initOption`
            }
        ])
        .then((response) => {
            console.log(response.initOption)
            switch(response.initOption) {
                case `View all departments`:
                    showAllPromise('department')
                    break;
                case `View all roles`:
                    showAllPromise('role')
                    break;
                case `View all employees`:
                    showAllPromise('employee');
                    break;
                case `Add a department`:
                    this.addDepartment();
                    break;
                case `Add a role`:
                    this.addRole();
                    break;
                case `Add an employee`:
                    this.addEmployee();
                    break;
                case `Update an employee role`:
                    this.updateEmp('role');
                    break;
                case `Update an employee's manager`:
                    this.updateEmp('manager')
            }
        })
    }
    addDepartment() {
        inquirer
        .prompt([
            {
                message: `Enter the name of the new department:`,
                name: `newDepartment`
            }
        ])
        .then((response) => {
            dbFunc.addNew(response, 'department')
            this.init();
        })
    }
    addRole() {
        let departments = [];

        const callInfo = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('department', true));
        });
        callInfo.then((response) => {
            departments = response;

            inquirer
            .prompt([
                {
                    message: `Enter the name of the new role:`,
                    name: `newRoleName`
                },
                {
                    message: `Enter the salary of the new role:`,
                    name: `newRoleSalary`
                },
                {
                    type: 'list',
                    choices: departments,
                    loop: false,
                    message: `Enter the department the role belongds to:`,
                    name: `newRoleDep`
                }
            ])
            .then((response) => {
                dbFunc.addNew(response, 'role')
                this.init();
            })
        });
    }
    addEmployee() {

        let roles = [];
        let managers = [];

        const callRoles = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('role', true));
        });
        const callManager = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('employee', true, true));
        });

        Promise.all([callRoles, callManager]).then((response) => {

            roles = response[0];
            managers = response[1];
            managers.unshift('None');

            inquirer
            .prompt([
                {
                    message: `Enter the new employee's first name:`,
                    name: `newEmpFN`
                },
                {
                    message: `Enter the new employee's last name:`,
                    name: `newEmpLN`
                },
                {
                    type: 'list',
                    choices: roles,
                    loop: false,
                    message: `Enter the new employee's role:`,
                    name: `newEmpRole`
                },
                {
                    type: 'list',
                    choices: managers,
                    loop: false,
                    message: `Enter the new employee's manager if they have one:`,
                    name: `newEmpManager`
                }
            ])
            .then((response) => {
                dbFunc.addNew(response, 'employee')
                this.init();
            })
        });
    }
    updateEmp(param) {

        let emps = [];

        let param = [];

        const callEmps = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('employee', true));
        });

        if (param = 'role') {
            const callParam = new Promise((resolve, reject) => {
                resolve(dbFunc.showAll('role', true));
            });
            return callParam;
        } else if (param = 'manager') {
            const callParam = new Promise((resolve, reject) => {
                resolve(dbFunc.showAll('employee', true, true))
            });
            return callParam;
        }

        Promise.all([callEmps, callParam]).then((response) => {

            emps = response[0];
            param = response[1];
            
        inquirer
        .prompt([
            {
                type: 'list',
                choices: emps,
                loop: false,
                message: `Chose the employee that needs to be updated:`,
                name: `chosenEmp`
            },
            {
                type: 'list',
                choices: param,
                loop: false,
                message: `Chose the new ${param} to apply to the employee:`,
                name: `chosenParam`
            }
        ])
        .then((response) => {
        //     dbFunc.updateEmp(response.chosenEmp, response.chosenRole);
        //     this.init();
            console.log(response);
        })
        });
    }
}

showAllPromise = choice => {
    const callInfo = new Promise((resolve, reject) => {
        resolve(dbFunc.showAll(choice));
    });
    callInfo.then((response) => {
        console.table(response);
        // console.log('Promise resolved!');
        const prompts = new Prompts;
        prompts.init();
    });
}


const prompts = new Prompts;
prompts.init();

module.exports = Prompts;