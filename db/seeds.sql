
-- seeds for the department table
INSERT INTO department
    (dept_name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");


-- seeds for the role table
INSERT INTO roles
    (title, salary, department_id)
VALUES
    ("Sales Lead", "100000", 1),
    ("Salesperson", "80000", 1),
    ("Lead Engineer", "150000", 2),
    ("Software Engineer", "120000", 2),
    ("Account Manager", "160000", 3),
    ("Accountant", "125000", 3),
    ("Legal Team Lead", "250000", 4),
    ("Lawyer", "190000", 4);

-- seeds for the employee table
INSERT INTO employees
    (first_name, last_name, roles_id, manager_id)
VALUES
    ("John", "Doe", 1, 0),
    ("Mike", "Chan", 2, 1),
    ("Ashley", "Rodriguez", 3, 0),
    ("Kevin", "Tupik", 4, 3),
    ("Kunal", "Singh", 5, 0),
    ("Malia", "Brown", 6, 5),
    ("Sarah", "Lourd", 7, 0),
    ("Tom", "Allen", 8, 7);