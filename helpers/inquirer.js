// Contains the inqruier prompts and paths, exports to index.js
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Credentials = require('./credentials');


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

                    break;
                case `View all roles`:

                    break;
                case `View all employees`:

                    break;
                case `Add a department`:

                    break;
                case `Add a role`:

                    break;
                case `Add an employee`:

                    break;
                case `Update and employee role`:
            }
        })
    }
    addDepartment() {

    }
    addRole() {

    }
    addEmployee() {

    }
    updateEmpRole() {

    }
}

module.exports = Prompts;