
-- seeds for the department table
INSERT INTO department
    (id, dept_name)
VALUES
    (001, "Sales"),
    (002, "Engineering"),
    (003, "Finance"),
    (004, "Legal");


-- seeds for the role table
INSERT INTO role
    (id, title, salary, dept_id)
VALUES
    (001, "Sales Lead", "100000", "001"),
    (002, "Salesperson", "80000", "001"),
    (003, "Lead Engineer", "150000", "002"),
    (004, "Software Engineer", "120000", "002"),
    (005, "Account Manager", "160000", "003"),
    (006, "Accountant", "125000", "003"),
    (007, "Legal Team Lead", "250000", "004"),
    (008, "Lawyer", "190000", "004")

-- seeds for the employee table
INSERT INTO employee
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (001, "John", "Doe", "001", NULL),
    (002, "Mike", "Chan", "002", "001"),
    (003, "Ashley", "Rodriguez", "003", NULL),
    (004, "Kevin", "Tupik", "004", "003"),
    (005, "Kunal", "Singh", "005", NULL),
    (006, "Malia", "Brown", "006", "005"),
    (007, "Sarah", "Lourd", "007", NULL),
    (008, "Tom", "Allen", "008", "007")