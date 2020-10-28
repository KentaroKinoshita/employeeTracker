const mysql = require('mysql')
const inquirer = require('inquirer');
const Choices = require('inquirer/lib/objects/choices');

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

function mainMenu () {
    // ask what they want to do
    inquirer
    .prompt({
        name: "mainMenu",
        type: "list",
        message: "MAIN MENU",
        choices: [
            "View All Employees",
            "View all employees by role",
            "View all employees by department",
            "View all employees by manager",
            "Add employee",
            "Add role",
            "Add department"
        ]
    }).then((answer) => {
        // switch actions
        switch (answer.mainMenu) {
            case "View all employees":
                viewAllEmp();
                break;

            case "View all employees by department":
                viewAllEmpByDept();
                break;

            case "View all employees by role":
                viewAllEmpByRole();
                break;

            case "Add employee":
                addEmp();
                break;

            case "Add department":
                addDept();
                break;

            case "Add role":
                addRole();
                break;
        }
    })
}