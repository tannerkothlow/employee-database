-- Initialize 4 departments
INSERT INTO department (name)
VALUES  ('Produce'),
        ('Bakery'),
        ('Meat'),
        ('Deli');

-- Initialize 7 roles
INSERT INTO role (title, salary, department_id)
VALUES  ('Stocker', 26000, 1),
        ('Baker', 32000, 2),
        ('Wrapper', 29000, 2),
        ('Cutter', 43000, 3),
        ('Rotisserie', 32000, 4),
        ('Deli Manager', 65000, 4),
        ('Fresh Manager', 54000, 2);

-- Initialize 10 employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Blake', 'Blakeson', 6, null),
        ('Greg', 'Gregson', 6, null),
        ('Jim', 'Jenson', 7, null),
        ('Tanner', 'Kothlow', 5, 1),
        ('Zoe', 'Kothlow', 4, 1),
        ('Alex', 'Soltero', 4, 4),
        ('Maddie', 'Mewo', 3, 3),
        ('Diego', 'Grill', 2, 3),
        ('Doug', 'Douglas', 1, 2);
        