// Contains the inqruier prompts and paths, exports to index.js
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const DBFunc = require('./mysql');

const dbFunc = new DBFunc;

const conTabCol = '\x1b[34m%s\1xb[0m';
const conMag = '\x1b[35m%s\x1b[0m';
const conGood = '\x1b[32m%s\x1b[0m';

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
            // console.log(response.initOption)
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
                    this.updateEmp('manager');
                    break;
                case `View employees by manager`:
                    this.viewEmpByManager();
                    break;
                case `Remove department, role, or employee`:
                    this.deleteElement();
                    break;
                case `View salary budgets per department`:
                    this.viewBudget();
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

        // console.log(param);

        let emps = [];
        let paramArray = [];

        let callParam;

        const callEmps = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('employee', true));
        });

        if (param == 'role') {
            callParam = new Promise((resolve, reject) => {
                resolve(dbFunc.showAll('role', true));
            });
        } else if (param == 'manager') {
            callParam = new Promise((resolve, reject) => {
                resolve(dbFunc.showAll('employee', true, true))
            });
        }

        Promise.all([callEmps, callParam]).then((response) => {

            emps = response[0];
            paramArray = response[1];
            
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
                choices: paramArray,
                loop: false,
                message: `Chose the new ${param} to apply to the employee:`,
                name: `chosenParam`
            }
        ])
        .then((response) => {
            dbFunc.updateEmp(response.chosenEmp, response.chosenParam, param);
            this.init();
        //     console.log(response);
        })
        });
    }
    viewEmpByManager() {
        const getManagers = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('employee', true, true))
        });
        getManagers.then((response) => {
            let managers = response;
            inquirer
            .prompt([
                {
                    type: 'list',
                    choices: managers,
                    loop: false,
                    message: `Chose a manager to view who they manage`,
                    name: `chosenManager`
                }
            ])
            .then((response) => {
                const callInfo = new Promise((resolve, reject) => {
                    resolve(dbFunc.showEmpByManager(response.chosenManager));
                });
                callInfo.then((response) => {
                    if (response.length > 0) {console.table(response);}
                    else {console.log(conTabCol, `No employees found for this manager!`)}
                    
                    this.init();
                });
            })
        })
    }
    deleteElement() {
        inquirer
        .prompt([
            {
                type: 'list',
                loop: false,
                choices: [
                    `Departments`,
                    `Roles`,
                    `Employees`
                ],
                message: 'Chose what you want to delete',
                name: 'delChoice'
            }
        ])
        .then((response) => {
            const param = response.delChoice.toLowerCase().slice(0, -1);
            // console.log(`The edited param ${param}`);
            const callChoices = new Promise (resolve => {
                resolve(dbFunc.showAll(`${param}`, true));
            });
            callChoices.then((response) => {
                let paramChoices = response;
                inquirer
                .prompt([
                    {
                        type: 'list',
                        loop: false,
                        choices: paramChoices,
                        message: `Choose what you want to delete`,
                        name: `delElement`
                    },
                    {
                        type: 'list',
                        loop: false,
                        choices: [
                            `[NO - CANCEL]`,
                            `[YES - DELETE]`
                        ],
                        message: `ARE YOU SURE? \n This cannot be undone!`,
                        name: `confirm`
                    }
                ])
                .then((response) => {
                    // const delElement = response.delElement
                    if (response.confirm == `[YES - DELETE]`) {
                        dbFunc.deleteElement(param, response.delElement);
                        this.init();
                    } else {
                        console.log(conGood, `++ Deletion canceled. ++`);
                        this.init();
                    }
                })
            })
        })
    }
    viewBudget() {
        const callInfo = new Promise((resolve, reject) => {
            resolve(dbFunc.showAll('department', true));
        });
        callInfo.then((response) => {
            let departments = response;
            inquirer
            .prompt([
                {
                    type: 'list',
                    loop: false,
                    choices: departments,
                    message: `Chose a department to see the combined salary of all employees`,
                    name: `chosenDepartment`
                }
            ])
            .then((response) => {
                const getSalaries = new Promise((resolve, reject) => {
                    resolve(dbFunc.viewSalaries(response.chosenDepartment))
                })
                .then((response) => {
                    console.log(response);
                    this.init();
                })
            })
        })
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

// const prompts = new Prompts;
// prompts.init();

module.exports = Prompts;