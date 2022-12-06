
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department
(
  id INT,
  dept_name VARCHAR(30) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE role
(
  id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary INT NOT NULL,
  dept_id INT NOT NULL
    PRIMARY KEY (id)
    FOREIGN KEY (department_id) REFERENCES department (id) ON DELETE SET NULL
);

CREATE TABLE employee
(
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT
    PRIMARY KEY (id)
    FOREIGN KEY (role_id) REFERENCES role (id)
    FOREIGN KEY (manager_id) REFERENCES employee (id) ON DELETE SET NULL
);