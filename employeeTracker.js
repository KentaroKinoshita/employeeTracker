const mysql = require('mysql')
const inquirer = require('inquirer')

// Connection Properties
const connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Chie123.",
    database: "employees_db"
}

// creating connection
const connection = mysql.createConnection(connectionProperties);

// Establishing connection to the database
connection.connect((err) => {
    if (err) throw err;

    console.log("\n WELCOME TO EMPLOYEE TRACKER \n")
    mainMenu();
})

