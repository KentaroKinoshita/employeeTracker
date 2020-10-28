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
    let quesry = "SELECT * FROM employee;"    
    // query from connection
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("\n");

        // Display query results using console.table
        console.table(res);

        //Back to main menu
        mainMenu();
    });
}

function viewAllEmpByDept(){

    // Set global array to store department names
    let deptArr = [];

    // Create new connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // Query just names of departments
        return conn.query('SELECT name FROM department');
    }).then(function(value){

        // Place all names within deptArr
        deptQuery = value;
        for (i=0; i < value.length; i++){
            deptArr.push(value[i].name);
            
        }
    }).then(() => {

        // Prompt user to select department from array of departments
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department would you like to search?",
            choices: deptArr
        })    
        .then((answer) => {

            // Query all employees depending on selected department
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;
            connection.query(query, (err, res) => {
                if(err) return err;
                
                // Show results in console.table
                console.log("\n");
                console.table(res);

                // Back to main menu
                mainMenu();
            });
        });
    });
}

// view all employees by role
function viewAllEmpByRole(){

    // set global array to store all roles
    let roleName = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        // Query all roles
        return conn.query('SELECT title FROM role');
    }).then(function(roles){

        // Place all roles within the roleArry
        for (i=0; i < roles.length; i++){
            roleName.push(roles[i].title);
        }
    }).then(() => {

        // Prompt user to select a role
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "WHICH ROLE WOULD YOU LIKE TO CHECK?",
            choices: roleName
        })    
        .then((answer) => {

            // Query all employees by role selected by user
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
            connection.query(query, (err, res) => {
                if(err) return err;

                // show results using console.table
                console.log("\n");
                console.table(res);
                mainMenu();
            });
        });
    });
}

// add employee

function addEmp (){
    let roleArr = [];
    let managerArr = [];

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, managers]) => {
        
        for(let i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title)
        }

        for (i=0; i < managers.length; i++){
            managerArr.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {
        managerArr.unshift('--');

        inquirer.prompt([{
            name: "firstName",
            type: "input",
            message: "First name: ",
            // Validate field is not blank
            validate: function(input){
                if (input === ""){
                    console.log("**FIELD REQUIRED**");
                    return false;
                }
                else{
                    return true;
                }
            }
        },
        {
            // Prompt user of their last name
            name: "lastName",
            type: "input",
            message: "Lastname name: ",
            // Validate field is not blank
            validate: function(input){
                if (input === ""){
                    console.log("**FIELD REQUIRED**");
                    return false;
                }
                else{
                    return true;
                }
            }
        },
        {
            // Prompt user of their role
            name: "role",
            type: "list",
            message: "What is their role?",
            choices: roleArr
        },
        {
            name: "manager",
            type: "list",
            message: "Who is their manager?",
            choices: managerArr
        }
    ]).then((answer) => {
        let roleID;
        let managerID = null;

        for (i=0; i < roles.length; i++){
            if (answer.role == roles[i].title){
                roleID = roles[i].id;
            }
        }

        // get ID of manager selected
        for (i=0; i < managers.length; i++){
            if (answer.manager == managers[i].Employee){
                managerID = managers[i].id;
            }
        }

        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
            if(err) return err;

            // Confirm employee has been added
            console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
            mainMenu();
        });
    })
    })
}

function addRole(){

    // Create array of departments
    let departmentArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        // Query all departments
        return conn.query('SELECT id, name FROM department ORDER BY name ASC');

    }).then((departments) => {
        
        // Place all departments in array
        for (i=0; i < departments.length; i++){
            departmentArr.push(departments[i].name);
        }

        return departments;
    }).then((departments) => {
        
        inquirer.prompt([
            {
                // Prompt user role title
                name: "roleTitle",
                type: "input",
                message: "Role title: "
            },
            {
                // Prompt user for salary
                name: "salary",
                type: "number",
                message: "Salary: "
            },
            {   
                // Prompt user to select department role is under
                name: "dept",
                type: "list",
                message: "Department: ",
                choices: departmentArr
            }]).then((answer) => {

                // Set department ID variable
                let deptID;

                // get id of department selected
                for (i=0; i < departments.length; i++){
                    if (answer.dept == departments[i].name){
                        deptID = departments[i].id;
                    }
                }

                // Added role to role table
                connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`, (err, res) => {
                    if(err) return err;
                    console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
                    mainMenu();
                });

            });

    });
    
}

function addDept(){

    inquirer.prompt({

            // Prompt user for name of department
            name: "deptName",
            type: "input",
            message: "Department Name: "
        }).then((answer) => {
                
            // add department to the table
            connection.query(`INSERT INTO department (name)VALUES ("${answer.deptName}");`, (err, res) => {
                if(err) return err;
                console.log("\n DEPARTMENT ADDED...\n ");
                mainMenu();
            });

        });
}
