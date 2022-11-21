const Prompts = require('./inquirer');
require('dotenv').config({ path: './.env' });

const prompts = new Prompts;
prompts.init();