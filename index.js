const mysql = require('mysql2');
// const inquirer = require('inquirer');
// const cTable = require('console.table');
const Prompts = require('./helpers/inquirer.js');
// const DBFunc = require('./helpers/mysql.js');

require('dotenv').config({ path: './.env' });

// const dbConfig = {
//     host: 'localhost',
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// }

// const db = mysql.createConnection(
//     dbConfig, 
//     console.log(`Connected to ${dbConfig.database}`)
// ).promise();

const prompts = new Prompts;

prompts.init();