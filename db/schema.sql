DROP DATABASE IF EXISTS company_db;
CREATE database company_db;

USE company_db;

-- Create table department
CREATE TABLE department
(
  id INT NOT NULL
  AUTO_INCREMENT,
  dept_name VARCHAR
  (30) NOT NULL,
  PRIMARY KEY
  (id)
);

  -- Create table employee
  CREATE TABLE employees
  (
    id INT NOT NULL
    AUTO_INCREMENT,
    first_name VARCHAR
    (30) NOT NULL,
    last_name VARCHAR
    (30) NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY
    (id)
);

    -- Create table roles
    create table roles
    (
      id INT NOT NULL
      AUTO_INCREMENT,
    title VARCHAR
      (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY
      (id)
);