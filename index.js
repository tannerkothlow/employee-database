const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Prompts = require('./helpers/inquirer.js');
const DBFunc = require('./helpers/mysql.js');

const prompts = new Prompts;

require('dotenv').config({ path: './.env' });

// const db = mysql.createConnection(
//     {
//         host: 'localhost',
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME
//     },
//     console.log(`Connect to the bigstore_db database.`)
// );

prompts.init();