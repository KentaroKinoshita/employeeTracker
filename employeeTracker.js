const mysql = require('mysql')
const inquirer = require('inquirer');
const promisemysql = require("promise-mysql");

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

function viewAllEmp(){
    // query to view all employees
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";
    
    // query from connection
    connection.query(query, (err) => {
        if (err) throw err;
        console.log("\n");

        // Display query results using console.table
        console.table(res);

        //Back to main menu
        mainMenu();
    })
}

function viewAllEmpByDept (){
    let deptName = [];

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return conn.query('SELECT name FROM department');
    }).then((value) => {
        deptName = value;
        for(let i = 0; i < value.length; i++){
            deptName.push(value[i].name)
        }
    }).then(() => {
        inquirer
        .prompt({
            name: "department",
            type: "list",
            message: "WHICH DEPARTMENT WOULD YOU LIKE TO CHECK?",
            choices: deptName
        }).then((answer) => {
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;

            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.table(res);

                // Back to main menu
                mainMenu();
            })
        })
    })
}
