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
                message: `What would you like to do?`,
                name: `initOption`
            }
        ])
        .then((response) => {
            console.log(response.initOption)
            switch(response.initOption) {
                case `View all departments`:
                    // dbFunc.allDepartments
                    break;
                case `View all roles`:
                    // dbFunc.allRoles
                    break;
                case `View all employees`:
                    // dbFunc.allEmployees
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
                message: `Enter the name of the department`,
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

    }
    addEmployee() {

    }
    updateEmpRole() {

    }
}

module.exports = Prompts;