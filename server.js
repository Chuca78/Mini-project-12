// need to run the following in the console for installations
// npm i console.table
// npm i inquirer@8.2.4
// npm install --save mysql2
// npm install dotenv


// load dependencies
const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
require('console.table');

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const connection = mysql.createConnection(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3001
  }
);
console.log(`Connected to the company_db database.`)

// connects to sql server and sql database
connection.connect(function(err){
  // throw error if there is issue connecting 
  if (err) throw err;
  // prompt user with inquirer
  cli_prompt();
});


// todo: write query, add, and delete functions here
// user prompts
const mainPrompt = [
  {
    name: "action",
    type: "list",
    message: "Select an action",
    choices: [
      "View All Employees",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit" 
    ]
  }
];

// prompt user with inquirer and execute function that user selected
function cli_prompt() {
  // prompt user actions using inquirer 
  inquirer.prompt(mainPrompt)
  // await user response from inquirer
  .then(function(answer) {
    // execute function viewAll if user selection is "View All Employees"
    if(answer.action == "View All Employees") {
      viewAll();
    }
    // execute function addEmployee if user selection is "Add Employee"
    else if(answer.action == "Add Employee") {
      addEmployee();
    }
    // execute function deleteEmployee if user selection is "Remove Employee"
    else if(answer.action == "Remove Employee") {
      deleteEmployee();
    }
    // execute function updateEmployee if user selection is "Update Employee Role"
    else if(answer.action == "Update Employee Role") {
      updateEmployee();
    }
    // execute function viewRoles if user selection is "View All Roles"
    else if(answer.action == "View All Roles") {
      viewRoles();
    }
    // execute function addRole if user selection is "Add Role"
    else if(answer.action == "Add Role") {
      addRole();
    }
    // execute function viewDept if user selection is "View All Departments"
    else if(answer.action == "View All Departments") {
      viewDept();
    }
    // execute function addDept if user selection is "Add Department"
    else if(answer.action == "Add Department") {
      addDept();
    }
    // execute function quit if user selection is "Quit"
    else if(answer.action == "Quit") {
      quit();
      };
  });    
};

// User action functions

// view all employees in employee_db
function viewAll() {
  // SQL command to get employee first_name/ last_name/ manager id, role title/ salary and department name data from employees, roles, and department tables
  let query =
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name AS department, employees.manager_id " +
    "FROM employees " +
    "JOIN roles ON roles.id = employees.role_id " +
    "JOIN department ON roles.department_id = department.id " +
    "ORDER BY employees.id;";
  // connect to mySQL useing query instruction to access employees table
  connection.query(query, function(err, res) {      
    // throw error if there is issue accessing data
    if (err) throw err;
    // add manager names to the manager_id col to be displayed in terminal
    for(i = 0; i < res.length; i++) {
      // if manager_Id contains a "0" then lable it as "None"
      if(res[i].manager_id == 0) {              
        res[i].manager = "None"           
      }
      else{
        // create new row called manager, containing each employee's manager name
        res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
      };
      // remove manager id from res so as to not display it
      delete res[i].manager_id;
    };
    // print data retrieved to terminal in table format 
    console.table(res);       
    // prompt user for next action
    cli_prompt();
});
};

// view all departments in employee_db
function viewDept() {
  // SQL command to get data from department table
  let query = "SELECT department.dept_name AS departments FROM department;";
  // connect to mySQL useing query instruction to access departments table
  connection.query(query, function(err, res) {      
    // throw error if the is issue accessing data
    if (err) throw err;
    // print data retrieved to terminal in table format 
    console.table(res);       
    // prompt user for next action
    cli_prompt();
  });
};

// view all roles in employee_db
function viewRoles() {
  // SQL command to get data from roles table
  let query = "SELECT roles.title, roles.salary, department.dept_name AS department FROM roles INNER JOIN department ON department.id = roles.department_id;";
  // connect to mySQL useing query instruction to access roles table
  connection.query(query, function(err, res) {      
    // throw error if the is issue accessing data
    if (err) throw err;
    // print data retrieved to terminal in table format 
    console.table(res);       
    // prompt user for next action
    cli_prompt();
  });
};

// add new employee to employee_db
function addEmployee() {
  // SQL command to get data from roles table
  let query = "SELECT title FROM roles";  
  // SQL command to get employee first_name/ last_name/ manager id, role title/ salary and department name data from employees, roles, and department tables
  let query2 =
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
    "FROM employees " +
    "JOIN roles ON roles.id = employees.role_id " +
    "JOIN department ON roles.department_id = department.id " +
    "ORDER BY employees.id;";
  // connect to mySQL using query instruction 1 to access data from roles table
  connection.query(query, function(err, res){
  // throw error if there is issue accessing data
  if (err) throw err;
  // assign data from roles table (res) to rolesList 
  let rolesList = res;
  // connect to mySQL using query instruction 2 to access dept_name from department table
  connection.query(query2, function(err,res) {          
    // throw error if there is issue accessing data
    if (err) throw err;
    // add manager names to the manager_id col to be displayed in terminal
    for(i = 0; i < res.length; i++) {
      // if manager_Id contains a "0" then lable it as "None"
      if(res[i].manager_id == 0) {                  
        res[i].manager = "None"               
      }
      else{
        // create new row called manager, containing each employee's manager name
        res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
      };
      // remove manager id from res so as to not display it
      delete res[i].manager_id;
    };
    // print data retrieved to terminal in table format 
    console.table(res);
    // assign data from employees table (res) to managerList
    let managerList = res;
    // array of actions to prompt user
    let addEmpPrompt = [
      {          
        name: "first_name",
        type: "input",
        message: "Enter new employee's first name."                  
      },          
      {          
        name: "last_name",
        type: "input",
        message: "Enter new employee's last name."                  
      },          
      {          
        name: "select_role",
        type: "list",
        message: "Select new employee's role.",
        // dynamic choises using rolesList (title col of roles table)
        choices: function() {                      
          // init roles array - used to return existing roles titles as choises array prompted to user
          roles = [];                      
          // loop through rolesList to extract the role titles from rolesList which is an object array containing data from roles table in the form of rowPackets
          for(i = 0; i < rolesList.length; i++) {                          
            // looping parameter "i" will allways align with the table index, therefore by adding 1 we have effectivly converted it to match table id's
            const roleId = i + 1;
            // concat roleId and title strings and push the resulting string into our roles (choises) array 
            roles.push(roleId + ": " + rolesList[i].title);
          };                      
          // add string "0: Quit" to the beginning of roles (choises)
          roles.unshift("0: Quit");
          // return roles (choises) array to be rendered by inquirer to the user 
          return roles;          
        }                  
      },
      {          
        name: "select_manager",
        type: "list",
        message: "Select new employee's manager",                  
        // dynamic choises using managerList (first_name and last_name cols of employees table)
        choices: function() {                      
          // init managers array - used to return existing employee names as choises array prompted to user
          managers = [];        
          // loop through managerList to extract the employee names from managerList which is an object array containing data from employees table in the form of rowPackets
          for(i = 0; i < managerList.length; i++) {                          
            // looping parameter "i" will allways align with the table index, therefore by adding 1 we have effectivly converted it to match table id's
            const mId = i + 1;
            // concat mId, first_name, and last_name strings and push the resulting string into our managers (choises) array
            managers.push(mId + ": " + managerList[i].first_name + " " + managerList[i].last_name);                          
          };                      
          // add string "0: None" to the beginning of managers (choises)
          managers.unshift("0: None");
          // add string "E: Quit" to the beginning of managers (choises)
          managers.unshift("E: Quit");
          // return managers (choises) array to be rendered by inquirer to the user 
          return managers;
        },
        when: function( answers ) {                              
          return answers.select_role !== "0: Quit";                  
        }                  
      }          
    ];          
    // prompt user actions using inquirer 
    inquirer.prompt(addEmpPrompt)
    // await user responce from inquirer
    .then(function(answer) {
    // if user selects Quit return to main menu
    if(answer.select_role == "0: Quit" || answer.select_manager == "E: Quit") {
      // prompt user for next action
      cli_prompt();
    }
    else{
      console.log(answer);
      // SQL command to insert new data in employees table
      let query = "INSERT INTO employees SET ?";
      // connect to mySQL using query instruction to insert new employee in employee table
      connection.query(query,
      {
        first_name: answer.first_name,
        last_name: answer.last_name,                      
        // new emplyees table role_id col value is extracted by parsing roleId from the selected roles array string and converting it to int
        role_id: parseInt(answer.select_role.split(":")[0]),
        // new emplyees table manager_id col value is extracted by parsing mId from the selected managers array string and converting it to int
        manager_id: parseInt(answer.select_manager.split(":")[0])
      },
      function(err, res){
        // throw error if there is issue writing data
        if (err) throw err;                  
      })
      // array of actions to prompt user
      let addagainPrompt = [
        {                  
          name: "again",
          type: "list",
          message: "Would you like to add another employee?",
          choices: ["Yes","Quit"]                    
        }
      ];
      // prompt user actions using inquirer 
      inquirer.prompt(addagainPrompt)
      // await user responce from inquirer
      .then(function(answer) {
        // SQL command to get employee first_name/ last_name/ manager id, role title/ salary and department name data from employees, roles, and department tables
        let query =
          "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
          "FROM employees " +
          "JOIN roles ON roles.id = employees.role_id " +
          "JOIN department ON roles.department_id = department.id " +
          "ORDER BY employees.id;";
        // connect to mySQL using query instruction to access first_name, last_name from employees table
        connection.query(query, function(err,res) {            
          // throw error if there is issue accessing data
          if (err) throw err;
          // execute function addEmployee again if user selection is "Yes"
          if(answer.again == "Yes") {
              // prompt add new employee to employee_db
              addEmployee();                          
          // update employee first/ last_name table in terminal, and execute function cli_prompt if user selection is "Quit"
          }
          else if(answer.again == "Quit") {
            // add manager names to the manager_id col to be displayed in terminal
            for(i = 0; i < res.length; i++) {
              // if manager_Id contains a "0" then lable it as "None"
              if(res[i].manager_id == 0) {                                      
                res[i].manager = "None"                                   
              }
              else{
                // create new row called manager, containing each employee's manager name
                res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
              };
              // remove manager id from res so as to not display it
              delete res[i].manager_id;
            };
            // print data retrieved to terminal in table format 
            console.table(res);
            // prompt user for next action
            cli_prompt(); 
            };
          });
        });                
      };
    });
  })
})
};

// add new department to employee_db
function addDept() {
  // SQL command to get data from department table
  let query = "SELECT department.dept_name FROM department;";
  // connect to mySQL using query instruction to access data from department tables
  connection.query(query, function(err, res){
    // throw error if there is issue accessing data
    if (err) throw err;
    // print data retrieved to terminal in table format 
    console.table(res);      
    // array of actions to prompt user
    let addDeptPrompt = [
      {      
      name: "new_department",
      type: "input",
      message: "Enter a new company department."              
      },      
    ];      
    // prompt user actions using inquirer 
    inquirer.prompt(addDeptPrompt)
    // await user responce from inquirer
    .then(function(answer) {
      console.log(answer);
      // SQL command to insert new data in department table
      let query = "INSERT INTO department SET ?";          
      // connect to mySQL using query instruction to insert new company department in department table
      connection.query(query,
      {
          // write new department srting from user answers to dept_name col in department table, which has auto generated id so only one item import is needed
          dept_name: answer.new_department
      }, function(err, res){
          // throw error if there is issue writing data
          if (err) throw err;              
      });          
      // array of actions to prompt user
      let addagainPrompt = [
        {
          name: "again",
          type: "list",
          message: "Would you like to add another department?",
          choices: ["Yes","Quit"]
        },
      ];
      // prompt user actions using inquirer 
      inquirer.prompt(addagainPrompt)
      // await user responce from inquirer
      .then(function(answer) {
          // SQL command to get data from department table
          let query = "SELECT department.dept_name FROM department" ;
          // connect to mySQL using query instruction to access data from department tables
      connection.query(query, function(err, res){
        // throw error if there is issue accessing data
        if (err) throw err;
        // execute function addDept again if user selection is "Yes"
        if(answer.again == "Yes") {
          // prompt add new department to employee_db
          addDept();                  
        // update department name table displayed in terminal, and execute function cli_prompt if user selection is "Quit"
        }
        else if(answer.again == "Quit") {
          // print data retrieved to terminal in table format 
          console.table(res);
          // prompt user for next action
            cli_prompt(); 
          };  
        });
      });
    });
  });
};

// add new role to employee_db
function addRole() {
  // SQL command to get data from roles table and data from department.dept_name where department.id = roles.department_id
  let query1 = "SELECT roles.title AS roles, roles.salary, department.dept_name FROM roles INNER JOIN department ON department.id = roles.department_id;";
  // SQL command to get dept_name data from department table - used for prompting list of availible departments to pick from
  let query2 = "SELECT department.dept_name FROM department" ;
  // connect to mySQL using query instruction 1 to access data from roles & department tables
  connection.query(query1, function(err, res){
  // throw error if there is issue accessing data
  if (err) throw err;
  // print data retrieved to terminal in table format 
  console.table(res);
  // connect to mySQL using query instruction 2 to access dept_name from department table
  connection.query(query2, function(err,res) {          
    // throw error if there is issue accessing data
    if (err) throw err;
    // assign data from dept_name (res) to departmentList 
  let departmentList = res;
  // array of actions to prompt user
  let addRolePrompt = [
    {          
      name: "add_role",
      type: "input",
      message: "Enter a new company role."                  
    },
    {          
      name: "add_salary",
      type: "input",
      message: "Enter a salary for this role."                  
    },
    {          
      name: "select_department",
      type: "list",
      message: "Select a department.",
      // dynamic choises using departmentList (dept_name col of department table)
      choices: function() {                      
        // init departments array - used to return existing department names as choises array prompted to user 
        departments = [];                      
        // loop through departmentList to extract the department names from depatmentList which is an object array containing data from department table in the form of rowPackets
        for(i = 0; i < departmentList.length; i++) {                           
          // looping parameter "i" will allways align with the table index, therefore by adding 1 we have effectivly converted it to match table id's 
          const roleId = i + 1;
          // concat roleId and dept_name strings and push the resulting string into our departments (choises) array 
          departments.push(roleId + ": " + departmentList[i].dept_name);
        };                      
        // add string "0: Quit" to the beginning of departments (choises)
        departments.unshift("0: Quit");
        // return departments (choises) array to be rendered by inquirer to the user 
        return departments;
      }
    }          
  ];        
    // prompt user actions using inquirer 
    inquirer.prompt(addRolePrompt)
    // await user responce from inquirer
    .then(function(answer) {
      // if user selects Quit return to main menu
      if(answer.select_department == "0: Quit") {
          // prompt user for next action
          cli_prompt();
      }
      else{
          console.log(answer);
          // SQL command to insert new data in roles table
          let query = "INSERT INTO roles SET ?";
          // connect to mySQL using query instruction to insert new company role in roles table
          connection.query(query,
          {
            title: answer.add_role,
            salary: answer.add_salary,                      
            // department_id is extracted by parsing roleId from the selected departments array string and converting it to int
            department_id: parseInt(answer.select_department.split(":")[0])
          }, function(err, res){
            // throw error if there is issue writing data
            if (err) throw err;                      
          });
          // array of actions to prompt user
          let addagainPrompt = [
              {
                name: "again",
                type: "list",
                message: "Would you like to add another role?",
                choices: ["Yes","Quit"]
              },
          ];
    // prompt user actions using inquirer 
    inquirer.prompt(addagainPrompt)
    // await user responce from inquirer
    .then(function(answer) {
        // SQL command to get data from roles table and data from department.dept_name where department.id = roles.department_id
        let query = "SELECT roles.id, roles.title AS roles, roles.salary, department.dept_name FROM roles INNER JOIN department ON department.id = roles.department_id;";
        // connect to mySQL using query instruction to access first_name, last_name from employees table
        connection.query(query, function(err,res) {              
          // throw error if there is issue accessing data
          if (err) throw err;
          // execute function addRole again if user selection is "Yes"
          if(answer.again == "Yes") {
            // prompt add new role to employee_db
            addRole();                          
          // update role table displayed in terminal, and execute function cli_prompt if user selection is "Quit"
          }
          else if(answer.again == "Quit") {
            // print data retrieved to terminal in table format 
            console.table(res);
            // prompt user for next action
            cli_prompt(); 
          };  
          });
        });              
      };
    });
  });
});  
};

// edit existing employee in employee_db
function updateEmployee() {
  // SQL command to get data from roles table
  let query = "SELECT title FROM roles";
  // SQL command to get employee first_name/ last_name/ manager id, role title/ salary and department name data from employees, roles, and department tables
  let query2 =
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
    "FROM employees " +
    "JOIN roles ON roles.id = employees.role_id " +
    "JOIN department ON roles.department_id = department.id " +
    "ORDER BY employees.id;";
  // connect to mySQL using query instruction 1 to access data from roles table
  connection.query(query, function(err, res){
    // throw error if there is issue accessing data
    if (err) throw err;
    // assign data from roles table (res) to rolesList 
    let rolesList = res;
    // connect to mySQL using query instruction 2 to access dept_name from department table
    connection.query(query2, function(err,res) {          
      // throw error if there is issue accessing data
      if (err) throw err;
      // add manager names to the manager_id col to be displayed in terminal
      for(i = 0; i < res.length; i++) {
        // if manager_Id contains a "0" then lable it as "None"
        if(res[i].manager_id == 0) {                  
          res[i].manager = "None"               
        }
        else{
          // create new row called manager, containing each employee's manager name
          res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
        };
        // remove manager id from res so as to not display it
        delete res[i].manager_id;
      };
      // print data retrieved to terminal in table format 
      console.table(res);
      // assign data from employees table (res) to managerList
      let employeeList = res;
      // array of actions to prompt user
      let addEmpPrompt = [
        {          
          name: "select_employee",
          type: "list",
          message: "Select employee to edit",                  
          // dynamic choises using managerList (first_name and last_name cols of employees table)
          choices: function() {                      
          // init managers array - used to return existing employee names as choises array prompted to user
          employees = [];          
          // loop through managerList to extract the employee names from managerList which is an object array containing data from employees table in the form of rowPackets
          for(i = 0; i < employeeList.length; i++) {                          
            // looping parameter "i" will allways align with the table index, therefore by adding 1 we have effectivly converted it to match table id's
            const mId = i + 1;
            // concat mId, first_name, and last_name strings and push the resulting string into our managers (choises) array
            employees.push(mId + ": " + employeeList[i].first_name + " " + employeeList[i].last_name);                          
          };                      
          // add string "0: None" to the beginning of managers (choises)
          employees.unshift("0: Quit");
          // return managers (choises) array to be rendered by inquirer to the user 
          return employees;          
          }                  
        }
      ];          
    // prompt user actions using inquirer 
    inquirer.prompt(addEmpPrompt)
    // await user responce from inquirer
    .then(function(answer) {
      // if user selects "0: Quit" return to main menu
      if(answer.select_employee == "0: Quit") {
        // prompt user for next action
        cli_prompt();
      }
      else{
        let empSelect = answer.select_employee.split(":")[0]
        let empPropPrompt = [              
        {                  
          name: "select_role",
          type: "list",
          message: "Edit employee role.",      
          // dynamic choises using rolesList (title col of roles table)
          choices: function() {                              
            // init roles array - used to return existing roles titles as choises array prompted to user
            roles = [];                              
            // loop through rolesList to extract the role titles from rolesList which is an object array containing data from roles table in the form of rowPackets
            for(i = 0; i < rolesList.length; i++) {                                  
              // looping parameter "i" will allways align with the table index, therefore by adding 1 we have effectivly converted it to match table id's
              const roleId = i + 1;      
              // concat roleId and title strings and push the resulting string into our roles (choises) array 
              roles.push(roleId + ": " + rolesList[i].title);      
            };
            // add string "0: Quit" to the beginning of roles (choises)
            roles.unshift("0: Quit");                              
            // return roles (choises) array to be rendered by inquirer to the user 
            return roles;                  
          }                          
        },      
        {                  
          name: "select_manager",
          type: "list",
          message: "Edit employee manager",
          // dynamic choises using managerList (first_name and last_name cols of employees table)
          choices: function() {                              
            // init managers array - used to return existing employee names as choises array prompted to user
            managers = [];                  
            // loop through managerList to extract the employee names from managerList which is an object array containing data from employees table in the form of rowPackets
            for(i = 0; i < employeeList.length; i++) {                                  
              // looping parameter "i" will allways align with the table index, therefore by adding 1 we have effectivly converted it to match table id's
              const mId = i + 1;
              // filter out emplyee from managers (choises) array that matches user selection of employee to edit
              if(answer.select_employee.split(": ")[1] !== employeeList[i].first_name + " " + employeeList[i].last_name) {          
                // concat mId, first_name, and last_name strings and push the resulting string into our managers (choises) array
                managers.push(mId + ": " + employeeList[i].first_name + " " + employeeList[i].last_name);
              };                                  
            };                              
            // add string "0: None" to the beginning of managers (choises)
            managers.unshift("0: None");
            // add string "E: Quit" to the beginning of managers (choises)
            managers.unshift("E: Quit");
            // return managers (choises) array to be rendered by inquirer to the user 
            return managers;                  
          },
          when: function( answers ) {                              
            return answers.select_role !== "0: Quit";                          
          }                          
        }                  
        ];
        // prompt user actions using inquirer 
        inquirer.prompt(empPropPrompt)
        // await user responce from inquirer
        .then(function(answer) {
          // if user selects "0: Quit" return to main menu
          if(answer.select_role == "0: Quit" || answer.select_manager == "E: Quit") {
            // prompt user for next action
            cli_prompt();
          }
          else{
            console.log(answer);
            // SQL command to insert new data in employees table
            let query = "UPDATE employees SET ? WHERE employees.id = " + empSelect;          
            // connect to mySQL using query instruction to insert new employee in employee table
            connection.query(query,
            {                              
              // new emplyees table role_id col value is extracted by parsing roleId from the selected roles array string and converting it to int
              role_id: parseInt(answer.select_role.split(":")[0]),          
              // new emplyees table manager_id col value is extracted by parsing mId from the selected managers array string and converting it to int
              manager_id: parseInt(answer.select_manager.split(":")[0])          
            },
            function(err, res){          
              // throw error if there is issue writing data
              if (err) throw err;                          
            });          
            // array of actions to prompt user
            let addagainPrompt = [          
              {                          
              name: "again",
              type: "list",
              message: "Would you like to add another employee?",
              choices: ["Yes","Quit"]                              
              }          
            ];          
            // prompt user actions using inquirer 
            inquirer.prompt(addagainPrompt)          
            // await user responce from inquirer
            .then(function(answer) {          
                // SQL command to get employee first_name/ last_name/ manager id, role title/ salary and department name data from employees, roles, and department tables
                let query =
                  "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
                  "FROM employees " +
                  "JOIN roles ON roles.id = employees.role_id " +
                  "JOIN department ON roles.department_id = department.id " +
                  "ORDER BY employees.id;";                            
                // connect to mySQL using query instruction to access first_name, last_name from employees table
              connection.query(query, function(err,res) {                      
                // throw error if there is issue accessing data
                if (err) throw err;          
                // execute function updateEmployee again if user selection is "Yes"
                if(answer.again == "Yes") {          
                  // prompt add new employee to employee_db
                  updateEmployee();                                  
                // update employee first/ last_name table in terminal, and execute function cli_prompt if user selection is "Quit"
                }
                else if(answer.again == "Quit") {
                  // add manager names to the manager_id col to be displayed in terminal
                  for(i = 0; i < res.length; i++) {
                    // if manager_Id contains a "0" then lable it as "None"
                    if(res[i].manager_id == 0) {
                      res[i].manager = "None" 
                    }else{
                      // create new row called manager, containing each employee's manager name
                      res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
                    };
                    // remove manager id from res so as to not display it
                    delete res[i].manager_id;
                  };
                  // print data retrieved to terminal in table format 
                  console.table(res);
                  // prompt user for next action
                  cli_prompt(); 
                  };  
                });
              });  
            };
          });    
        };
      });
    })
  })
};
// delete existing employee in employee_db
function deleteEmployee() {
  // SQL command to get data from roles table
  let query = "SELECT employees.id, employees.first_name, employees.last_name FROM employees;";
  // connect to mySQL using query instruction 1 to access data from roles table
  connection.query(query, function(err, res){
      // throw error if there is issue accessing data
      if (err) throw err;
      // combine names from first_name/ last_name cols to be displayed in terminal
      for(i = 0; i < res.length; i++) {
          // create new row called manager, containing each employee's manager name
          res[i].employee = res[i].first_name + " " + res[i].last_name;
          // empDisplay = res[i].first_name + " " + res[i].last_name;
          // remove first_name from res so as to not display it
          delete res[i].first_name;
          // remove last_name from res so as to not display it
          delete res[i].last_name;
      };
      // print data retrieved to terminal in table format 
      console.table(res);
      // assign data from employees table (res) to employeeList
      let employeeList = res;
      // array of actions to prompt user
      let addEmpPrompt = [
        {
          name: "select_employee",
          type: "list",
          message: "Terminate employee",
          // dynamic choises using employeeList (first_name and last_name cols of employees table)
          choices: function() {
              // init employees array - used to return existing employee names as choises array prompted to user
              employees = [];
              // loop through employeeList to extract the employee names from employeeList which is an object array containing data from employees table in the form of rowPackets
              for(i = 0; i < employeeList.length; i++) {
                  // concat mId, first_name, and last_name strings and push the resulting string into our employees (choises) array
                  employees.push(employeeList[i].id + ": " + employeeList[i].employee);
              };
              // add string "0: None" to the beginning of employees (choises)
              employees.unshift("0: Quit");
              // return employees (choises) array to be rendered by inquirer to the user 
              return employees;
          }
        },
        {
          name: "confirm",
          type: "list",
          // dynamic message using user selected employee name
          message: function(answers) {
            return "Are you sure you want to TERMINATE " + answers.select_employee.split(": ")[1];
          },
          // prompt user to pick between Yes and No
          choices: ["Yes","No"],
          // dont use this prompt if user selected Quit in previous prompt
          when: function( answers ) {
            return answers.select_employee !== "0: Quit";
          } 
        }
      ];
      // prompt user actions using inquirer 
      inquirer.prompt(addEmpPrompt)
      // await user responce from inquirer
      .then(function(answer) {
          // if user selects "0: Quit" return to main menu
          if(answer.select_employee == "0: Quit") {
            // prompt user for next action
            cli_prompt();
          // if user selects "No" restart deleteEmployee
          }
          else if(answer.confirm == "No") {
            // prompt user for next action
            deleteEmployee();
          }
          else{
            // SQL command to insert new data in employees table
            let query = "DELETE FROM employees WHERE employees.id =" + answer.select_employee.split(": ")[0];
            // connect to mySQL using query instruction to insert new employee in employee table
            connection.query(query, function(err, res) {
              // throw error if there is issue writing data
              if (err) throw err;
            });
            // array of actions to prompt user
            let addagainPrompt = [
              {
                name: "again",
                type: "list",
                message: "Would you like to remove another employee?",
                choices: ["Yes","Quit"]
              }
            ];
            // prompt user actions using inquirer 
            inquirer.prompt(addagainPrompt)
            // await user responce from inquirer
            .then(function(answer) {
              // SQL command to get data from employees table
              let query = "SELECT employees.id, employees.first_name, employees.last_name FROM employees;";
              // connect to mySQL using query instruction to access data from roles table
              connection.query(query, function(err, res){
                // throw error if there is issue accessing data
                if (err) throw err;
                // combine names from first_name/ last_name cols to be displayed in terminal
                for(i = 0; i < res.length; i++) {
                  // create new row called manager, containing each employee's manager name
                  res[i].employee = res[i].first_name + " " + res[i].last_name;
                  // remove first_name from res so as to not display it
                  delete res[i].first_name;
                  // remove last_name from res so as to not display it
                  delete res[i].last_name;
                };
                // execute function updateEmployee again if user selection is "Yes"
                if(answer.again == "Yes") {
                  // prompt add new employee to employee_db
                  deleteEmployee();
                // update employee first/ last_name table in terminal, and execute function cli_prompt if user selection is "Quit"
                }
                else if(answer.again == "Quit") {
                  // print data retrieved to terminal in table format 
                  console.table(res);
                  // prompt user for next action
                  cli_prompt(); 
                };
              });
            });
          };
      });
  });
};

// quit employee-tracker 
function quit() {
  // terminate mySQL connection
  connection.end();
  // send user message that connection has been terminated
  console.log("connection terminated");
};

