// need to run the following in the console for installations
// npm i console.table
// npm i inquirer@8.2.4
// npm install --save mysql2
// npm install dotenv

// load dependencies
const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
require('console.table');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

    console.log(`Connected to the company_db database.`)
);

// connects to sql server and sql database
connection.connect(function(err){

    // throw error if there is issue connecting 
    if (err) throw err;

    // prompt user with inquirer
    cli_prompt();

});

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
  
  // user prompt through inquirer that executes the function that is selected
  function cli_prompt() {
    inquirer.prompt(mainPrompt)
    .then(function(answer) {
      // choices of functions that user can initiate
      if(answer.action == "View All Employees") {
        viewAll();
      }
      else if(answer.action == "Add Employee") {
        addEmployee();
      }
      else if(answer.action == "Remove Employee") {
        deleteEmployee();
      }
      else if(answer.action == "Update Employee Role") {
        updateEmployee();
      }
      else if(answer.action == "View All Roles") {
        viewRoles();
      }
      else if(answer.action == "Add Role") {
        addRole();
      }
      else if(answer.action == "View All Departments") {
        viewDept();
      }
      else if(answer.action == "Add Department") {
        addDept();
      }
      else if(answer.action == "Quit") {
        quit();
        };
    });    
  };
  
  // User action functions
  function viewAll() {
    // SQL function to view all employee information
    let query =
      "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name AS department, employees.manager_id " +
      "FROM employees " +
      "JOIN roles ON roles.id = employees.role_id " +
      "JOIN department ON roles.department_id = department.id " +
      "ORDER BY employees.id;";
    // connect to mySQL using query instruction to access employees table
    connection.query(query, function(err, res) {      
      // throw error if there is issue accessing data
      if (err) throw err;
      for(i = 0; i < res.length; i++) {
        // if manager_Id contains a "0" then label it as "None"
        if(res[i].manager_id == 0) {              
          res[i].manager = "None"           
        }
        else{
          // create new row called manager, containing each employee's manager name
          res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
        };
        delete res[i].manager_id;
      };
      console.table(res);       
      // prompt user for next action
      cli_prompt();
  });
  };
  
  function viewDept() {
    // SQL function to view all departments
    let query = "SELECT department.dept_name AS departments FROM department;";
    connection.query(query, function(err, res) {      
      if (err) throw err;
      console.table(res);       
      cli_prompt();
    });
  };
  
  function viewRoles() {
    // SQL function to view all roles
    let query = "SELECT roles.title, roles.salary, department.dept_name AS department FROM roles INNER JOIN department ON department.id = roles.department_id;";
    connection.query(query, function(err, res) {      
      if (err) throw err;
      console.table(res);       
      cli_prompt();
    });
  };
  
  function addEmployee() {
    // SQL function to add an employee
    let query = "SELECT title FROM roles";  
    let query2 =
      "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
      "FROM employees " +
      "JOIN roles ON roles.id = employees.role_id " +
      "JOIN department ON roles.department_id = department.id " +
      "ORDER BY employees.id;";
    connection.query(query, function(err, res){
    if (err) throw err;
    let rolesList = res;
    connection.query(query2, function(err,res) {          
      if (err) throw err;
      for(i = 0; i < res.length; i++) {
        if(res[i].manager_id == 0) {                  
          res[i].manager = "None"               
        }
        else{
          res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
        };
        delete res[i].manager_id;
      };
      console.table(res);
      // assign data from employees table to managerList
      let managerList = res;
      let addEmpPrompt = [
        {          
          name: "first_name",
          type: "input",
          message: "Enter new employee's first name:"                  
        },          
        {          
          name: "last_name",
          type: "input",
          message: "Enter new employee's last name:"                  
        },          
        {          
          name: "select_role",
          type: "list",
          message: "Select new employee's role:",
          // displays all roles available to assign an employee
          choices: function() {                      
            roles = [];                      
            for(i = 0; i < rolesList.length; i++) {                          
              const roleId = i + 1;
              roles.push(roleId + ": " + rolesList[i].title);
            };                      
            // add string "0: Quit" to the beginning of choices
            roles.unshift("0: Quit");
            return roles;          
          }                  
        },
        {          
          name: "select_manager",
          type: "list",
          message: "Select new employee's manager",                  
          // displays all managers available to assign an employee
          choices: function() {                      
            // init managers array - used to return existing employee names as choices for user
            managers = [];        
            for(i = 0; i < managerList.length; i++) {                          
              const mId = i + 1;
              managers.push(mId + ": " + managerList[i].first_name + " " + managerList[i].last_name);                          
            };                      
            // add string "0: None" to the beginning of managers
            managers.unshift("0: None");
            // add string "E: Quit" to the beginning of managers
            managers.unshift("E: Quit");
            return managers;
          },
          when: function( answers ) {                              
            return answers.select_role !== "0: Quit";                  
          }                  
        }          
      ];          
      inquirer.prompt(addEmpPrompt)
      .then(function(answer) {
      if(answer.select_role == "0: Quit" || answer.select_manager == "E: Quit") {
        cli_prompt();
      }
      else{
        console.log(answer);
        let query = "INSERT INTO employees SET ?";
        connection.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,                      
          role_id: parseInt(answer.select_role.split(":")[0]),
          manager_id: parseInt(answer.select_manager.split(":")[0])
        },
        function(err, res){
          if (err) throw err;                  
        })
        // prompt to allow user to add multiple employees
        let addAgainPrompt = [
          {                  
            name: "again",
            type: "list",
            message: "Would you like to add another employee?",
            choices: ["Yes","Quit"]                    
          }
        ];
        inquirer.prompt(addAgainPrompt)
        .then(function(answer) {
          let query =
            "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
            "FROM employees " +
            "JOIN roles ON roles.id = employees.role_id " +
            "JOIN department ON roles.department_id = department.id " +
            "ORDER BY employees.id;";
          connection.query(query, function(err,res) {            
            if (err) throw err;
            // execute function addEmployee again if user selection is "Yes"
            if(answer.again == "Yes") {
                addEmployee();                          
            }
            else if(answer.again == "Quit") {
              for(i = 0; i < res.length; i++) {
                if(res[i].manager_id == 0) {                                      
                  res[i].manager = "None"                                   
                }
                else{
                  res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
                };
                delete res[i].manager_id;
              };
              console.table(res);
              cli_prompt(); 
              };
            });
          });                
        };
      });
    })
  })
  };
  
  function addDept() {
    // SQL function to add new department
    let query = "SELECT department.dept_name FROM department;";
    connection.query(query, function(err, res){
      if (err) throw err;
      console.table(res);      
      let addDeptPrompt = [
        {      
        name: "new_department",
        type: "input",
        message: "Enter a new department."              
        },      
      ];      
      inquirer.prompt(addDeptPrompt)
      .then(function(answer) {
        console.log(answer);
        let query = "INSERT INTO department SET ?";          
        connection.query(query,
        {
            dept_name: answer.new_department
        }, function(err, res){
            if (err) throw err;              
        });       
        // execute function addDept again if user selection is "Yes"
        let addAgainPrompt = [
          {
            name: "again",
            type: "list",
            message: "Would you like to add another department?",
            choices: ["Yes","Quit"]
          },
        ];
        inquirer.prompt(addAgainPrompt)
        .then(function(answer) {
            let query = "SELECT department.dept_name FROM department" ;
        connection.query(query, function(err, res){
          if (err) throw err;
          if(answer.again == "Yes") {
            addDept();                  
          }
          else if(answer.again == "Quit") {
            console.table(res);
              cli_prompt(); 
            };  
          });
        });
      });
    });
  };
  
  function addRole() {
    // SQL function to add a new role
    let query1 = "SELECT roles.title AS roles, roles.salary, department.dept_name FROM roles INNER JOIN department ON department.id = roles.department_id;";
    let query2 = "SELECT department.dept_name FROM department" ;
    connection.query(query1, function(err, res){
    if (err) throw err;
    console.table(res);
    connection.query(query2, function(err,res) {          
      if (err) throw err;
    let departmentList = res;
    let addRolePrompt = [
      {          
        name: "add_role",
        type: "input",
        message: "Enter a new role."                  
      },
      {          
        name: "add_salary",
        type: "input",
        message: "Enter salary for role."                  
      },
      {          
        name: "select_department",
        type: "list",
        message: "Select a department.",
        choices: function() {                      
          departments = [];                      
          for(i = 0; i < departmentList.length; i++) {                           
            const roleId = i + 1;
            departments.push(roleId + ": " + departmentList[i].dept_name);
          };                      
          departments.unshift("0: Quit");
          return departments;
        }
      }          
    ];        
      inquirer.prompt(addRolePrompt)
      .then(function(answer) {
        if(answer.select_department == "0: Quit") {
            cli_prompt();
        }
        else{
            console.log(answer);
            let query = "INSERT INTO roles SET ?";
            connection.query(query,
            {
              title: answer.add_role,
              salary: answer.add_salary,                      
              department_id: parseInt(answer.select_department.split(":")[0])
            }, function(err, res){
              if (err) throw err;                      
            });
            // execute function addRole again if user selection is "Yes"
            let addAgainPrompt = [
                {
                  name: "again",
                  type: "list",
                  message: "Would you like to add another role?",
                  choices: ["Yes","Quit"]
                },
            ];
      inquirer.prompt(addAgainPrompt)
      .then(function(answer) {
          let query = "SELECT roles.id, roles.title AS roles, roles.salary, department.dept_name FROM roles INNER JOIN department ON department.id = roles.department_id;";
          connection.query(query, function(err,res) {              
            if (err) throw err;
            
            if(answer.again == "Yes") {
              addRole();                          
            }
            else if(answer.again == "Quit") {
              console.table(res);
              cli_prompt(); 
            };  
            });
          });              
        };
      });
    });
  });  
  };
  
  function updateEmployee() {
    // SQL function to update employee information
    let query = "SELECT title FROM roles";
    let query2 =
      "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
      "FROM employees " +
      "JOIN roles ON roles.id = employees.role_id " +
      "JOIN department ON roles.department_id = department.id " +
      "ORDER BY employees.id;";
    connection.query(query, function(err, res){
      if (err) throw err;
      let rolesList = res;
      connection.query(query2, function(err,res) {          
        if (err) throw err;
        for(i = 0; i < res.length; i++) {
          if(res[i].manager_id == 0) {                  
            res[i].manager = "None"               
          }
          else{
            res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
          };
          delete res[i].manager_id;
        };
        console.table(res);
        let employeeList = res;
        let addEmpPrompt = [
          {          
            name: "select_employee",
            type: "list",
            message: "Select employee to update",                  
            choices: function() {                      
            employees = [];          
            for(i = 0; i < employeeList.length; i++) {                          
              const mId = i + 1;
              employees.push(mId + ": " + employeeList[i].first_name + " " + employeeList[i].last_name);                          
            };                      
            employees.unshift("0: Quit");
            return employees;          
            }                  
          }
        ];          
      inquirer.prompt(addEmpPrompt)
      .then(function(answer) {
        if(answer.select_employee == "0: Quit") {
          cli_prompt();
        }
        else{
          let empSelect = answer.select_employee.split(":")[0]
          let empPropPrompt = [              
          {                  
            name: "select_role",
            type: "list",
            message: "Edit employee role.",      
            // list of the existing roles that can be assigned to an employee
            choices: function() {                              
              roles = [];                              
              for(i = 0; i < rolesList.length; i++) {                                  
                const roleId = i + 1;      
                roles.push(roleId + ": " + rolesList[i].title);      
              };
              roles.unshift("0: Quit");                              
              return roles;                  
            }                          
          },      
          {                  
            name: "select_manager",
            type: "list",
            message: "Edit employee manager",
            choices: function() {                              
              managers = [];                  
              for(i = 0; i < employeeList.length; i++) {                                  
                const mId = i + 1;
                if(answer.select_employee.split(": ")[1] !== employeeList[i].first_name + " " + employeeList[i].last_name) {          
                  managers.push(mId + ": " + employeeList[i].first_name + " " + employeeList[i].last_name);
                };                                  
              };                              
              managers.unshift("0: None");
              managers.unshift("E: Quit");
              return managers;                  
            },
            when: function( answers ) {                              
              return answers.select_role !== "0: Quit";                          
            }                          
          }                  
          ];
          inquirer.prompt(empPropPrompt)
          .then(function(answer) {
            if(answer.select_role == "0: Quit" || answer.select_manager == "E: Quit") {
              cli_prompt();
            }
            else{
              console.log(answer);
              let query = "UPDATE employees SET ? WHERE employees.id = " + empSelect;          
              connection.query(query,
              {                              
                role_id: parseInt(answer.select_role.split(":")[0]),          
                manager_id: parseInt(answer.select_manager.split(":")[0])          
              },
              function(err, res){          
                if (err) throw err;                          
              });          
              // execute function updateEmployee again if user selection is "Yes"
              let addAgainPrompt = [          
                {                          
                name: "again",
                type: "list",
                message: "Would you like to update another employee?",
                choices: ["Yes","Quit"]                              
                }          
              ];          
              inquirer.prompt(addAgainPrompt)          
              .then(function(answer) {          
                  let query =
                    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
                    "FROM employees " +
                    "JOIN roles ON roles.id = employees.role_id " +
                    "JOIN department ON roles.department_id = department.id " +
                    "ORDER BY employees.id;";                            
                connection.query(query, function(err,res) {                      
                  if (err) throw err;          
                  if(answer.again == "Yes") {          
                    updateEmployee();                                  
                  }
                  else if(answer.again == "Quit") {
                    for(i = 0; i < res.length; i++) {
                      if(res[i].manager_id == 0) {
                        res[i].manager = "None" 
                      }else{
                        res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
                      };
                      delete res[i].manager_id;
                    };
                    console.table(res);
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

  function deleteEmployee() {
    // SQL function to delete an existing employee
    let query = "SELECT employees.id, employees.first_name, employees.last_name FROM employees;";
    connection.query(query, function(err, res){
        if (err) throw err;
        for(i = 0; i < res.length; i++) {
            res[i].employee = res[i].first_name + " " + res[i].last_name;
            delete res[i].first_name;
            delete res[i].last_name;
        };
        console.table(res);
        let employeeList = res;
        let addEmpPrompt = [
          {
            name: "select_employee",
            type: "list",
            message: "Remove employee",
            choices: function() {
                employees = [];
                for(i = 0; i < employeeList.length; i++) {
                    employees.push(employeeList[i].id + ": " + employeeList[i].employee);
                };
                employees.unshift("0: Quit");
                return employees;
            }
          },
          {
            name: "confirm",
            type: "list",
            message: function(answers) {
              return "Are you sure you want to remove " + answers.select_employee.split(": ")[1] + "?";
            },
            choices: ["Yes","No"],
            when: function( answers ) {
              return answers.select_employee !== "0: Quit";
            } 
          }
        ];
        inquirer.prompt(addEmpPrompt)
        .then(function(answer) {
            if(answer.select_employee == "0: Quit") {
              cli_prompt();
            }
            else if(answer.confirm == "No") {
              deleteEmployee();
            }
            else{
              let query = "DELETE FROM employees WHERE employees.id =" + answer.select_employee.split(": ")[0];
              connection.query(query, function(err, res) {
                if (err) throw err;
              });
              let addAgainPrompt = [
                {
                  name: "again",
                  type: "list",
                  message: "Would you like to remove another employee?",
                  choices: ["Yes","Quit"]
                }
              ];
              inquirer.prompt(addAgainPrompt)
              .then(function(answer) {
                let query = "SELECT employees.id, employees.first_name, employees.last_name FROM employees;";
                connection.query(query, function(err, res){
                  if (err) throw err;
                  for(i = 0; i < res.length; i++) {
                    res[i].employee = res[i].first_name + " " + res[i].last_name;
                    delete res[i].first_name;
                    delete res[i].last_name;
                  };
                  // execute function updateEmployee again if user selection is "Yes"
                  if(answer.again == "Yes") {
                    deleteEmployee();
                  }
                  else if(answer.again == "Quit") {
                    console.table(res);
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