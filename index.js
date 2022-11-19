const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Prompts = require('./helpers/inquirer.js');
const DBFunc = require('./helpers/mysql.js');

const prompts = new Prompts;

prompts.init();