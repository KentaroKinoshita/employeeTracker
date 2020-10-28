# employeeTracker

CLI Content Management System to manage a company's employees. The application links to an SQL database and allows users to view and manage employee records from the command line interface in a more user friendly environment.

The application gives yout the following options:
* View all employees with the option by role, department, or manager
* Add an employee, role, or department
* Update an employee role or manager
* Delete employee, role, or department
* View department salary budgets

## Installation

1. Run `npm install` to install all dependencies
2. Run `schema.sql` in MySQLWorkbench
    * (Optional) Run `seeds.sql` in MySQLWorkbench
3. Edit MySQL connection properties in the `connectionProperties` object in `employee-tracker.js`

## Tool & Resources
* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
* [MySQLWorkbench](https://www.mysql.com/products/workbench/) - Visual database design tool

    ### Dependencies
    
    * [inquirer](https://www.npmjs.com/package/inquirer) - For the CLI user interface. This will prompt user within the CLI for employee information.
    * [mysql](https://www.npmjs.com/package/mysql) - Used to connect to the MySQL database and perform queries
    * [promise-mysql](https://www.npmjs.com/package/promise-mysql) - Used to create promises from MySQL queries 
