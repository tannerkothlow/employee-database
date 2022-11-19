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
            console.log(response.newDepartment);
            // dbFunc.addDepartment(response.newDepartment);
            this.init();
        })
    }
    addRole() {

        // dbFunc.allDepartments polymorph
        let departments = [];

        const callInfo = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('department', true));
        });
        callInfo.then((response) => {
            departments = response;
            console.log(departments);
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
                message: `Enter the department the role belongds to:`,
                name: `newRoleDep`
            }
        ])
        .then((response) => {
            console.log(`Initialized addition of ${response.newRoleName}`);
            // dbFunc.addRole(response);
            // Deconstruct in function
            this.init();
        })
        });
    }
    addEmployee() {
        // First name, last name, role (array), employee's manager (none, array),

        const testRoles = [`Stocker`, `Baker`, `Meat Cutter`, `Deli chef`];
        // dbFunc.allRoles() polymorph
        const testManagers = [`None`, `John`, `Kyle`, `May`, `Blake`];
        // dbFunc.allEmployees() polymorph

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
                choices: testRoles,
                message: `Enter the new employee's role:`,
                name: `newEmpRole`
            },
            {
                type: 'list',
                choices: testManagers,
                message: `Enter the new employee's manager if they have one:`,
                name: `newEmpManager`
            }
        ])
        .then((response) => {
            console.log(response);
            // dbFunc.addEmployee(response);
            this.init();
        })
    }
    updateEmpRole() {
        // All employees, which role would you like to assign 

        // dbFunc.allEmployees polymorph
        const testEmps = [`Big Greg`, `Small Jim`, `Regular Pete`];
        // dbFunc.allRoles polymorph
        const testRoles = [`Stocker`, `Baker`, `Meat Cutter`, `Deli chef`];

        inquirer
        .prompt([
            {
                type: 'list',
                choices: testEmps,
                message: `Chose the employee that needs to be updated:`,
                name: `chosenEmp`
            },
            {
                type: 'list',
                choices: testRoles,
                message: `Chose the new role to apply to the employee:`,
                name: `chosenRole`
            }
        ])
        .then((response) => {
            console.log(response);
            this.init();
        })
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

const prompts = new Prompts;
prompts.init();

module.exports = Prompts;