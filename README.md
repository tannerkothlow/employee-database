# Week 12: Employee Database

## Description



## Installation

Once you have the repo cloned to your machine, run **npm i** to instal all the needed dependencies.

Then to initialize the database, open **./db** in an integrated terminal and login to mysql using **mysql -u root -p** or an appropriate equivilent. Then **source schema.sql;** to create the bigstore_db database. **Any preexisting database named bigstore_db will be dropped**. Once bigstore_db is created, enter **source seeds.sql;** to populate the department, role, and employee tables with starter entries.

To allow mysql2 to interact with the newly created database, rename **.env.EXAMPLE** to just **.env**. Then fill in your mysql password for **DB_PASSWORD** and the user for **DB_USER** (DB_USER will most likely be 'root').

Lastly, to run the application, navigate your integrated terminal to the root folder **/week-12-employee-database** and run **node index.js**.

## Usage

- Once you have run node index.js, you will be presented with a list of options to interact with the bigstore_db database.

![init](./project/images/init_prompt.PNG)

- There are a number of options to view the table data of bigstore_db. Chosing to view departments, roles, or employees will present you with a table of ALL relevent queries.

![init](./project/images/view_department.PNG)

- Employees with a manager_id of null are assumed to be managers themselves.

![init](./project/images/view_employees.PNG)

- Chosing to view the combined staff and salary of a given department will present the user with all departments in the department table. This function may throw an error if there are no roles assigned to that department, and/or no employees assigned to any of that department's roles.

![init](./project/images/view_salaries.PNG)

- To add to the database, chose any of the relevant add prompts. New departments require just a name, new roles require a name, salary, and a department assigned to them from a list. New employees require a first name, last name, role, and a manager. If an employee is added with the 'None' option for their manager, their manager_id will be set to null, and all subsequent functions will consider that employee a manager. All added elements will be assigned an incremental ID automatically.

![init](./project/images/add_employee.PNG)

- To update an employee's role or manager, select the relevant option from the list. You will be presented with a list of all employees and then a list of all roles/managers. Once confirmed, the employee will have their information updated. You can double check that the query was succesfull with the *View all employees* prompt.

![init](./project/images/update_emp_role.PNG)

- To delete an element, select the *Remove department, role, or employee* option. You will be presented with a list of all relevant table entires. You will then be prompted to confirm this action, chose *No* to cancel the deletion, and chose *Yes* to confirm. The cursor's default position will be on *No* in order to prevent accidental confirmations.

- It is recommended that you reassign roles and managers *before* any deletions take place. If you delete a manager, all employees previously under them will now a manager_id of null, meaning the app will consider them a manager. Likewise deleting a role will leave an employee's role_id null, which can result in errors.

![init](./project/images/delete_emp.PNG)

## License and Credit

Standard MIT license, coursework.

This project makes use of the [mysql2](https://www.npmjs.com/package/mysql2), [inquirer](https://www.npmjs.com/package//inquirer), [dotenv](https://www.npmjs.com/package/dotenv?ref=hackernoon.com), and [console.table](https://www.npmjs.com/package/console.table) packages.