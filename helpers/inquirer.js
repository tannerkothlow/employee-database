// Contains the inqruier prompts and paths, exports to index.js
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const DBFunc = require('./mysql');

const dbFunc = new DBFunc;

// Initializer (1) multiple choice that returns mysql data for viewing all departments, view all
// roles, view all employees, (1) add a department (1) add a role (1) add an employee, (1) and 
// update employee role. Plus a return function.

// 6 Functions needed

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
                `Update and employee role`
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
                case `Update and employee role`:
                    this.updateEmpRole();
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
    updateEmpRole() {

        let emps = [];
        let roles = [];

        const callRoles = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('employee', true));
        });
        const callManager = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('role', true, true));
        });

        Promise.all([callRoles, callManager]).then((response) => {

            emps = response[0];
            roles = response[1];
            
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
                choices: roles,
                loop: false,
                message: `Chose the new role to apply to the employee:`,
                name: `chosenRole`
            }
        ])
        .then((response) => {
            console.log(response);
            this.init();
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
        console.log('Promise resolved!');
        const prompts = new Prompts;
        prompts.init();
    });
}

addNewPromise = (response, param) => {
    // Eventually add stuff here
}

const prompts = new Prompts;
prompts.init();

module.exports = Prompts;