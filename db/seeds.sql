-- Initialize 4 departments
INSERT INTO department (name)
VALUES  ('Produce'),
        ('Bakery'),
        ('Meat'),
        ('Deli')

-- Initialize 6 roles
INSERT INTO role (title, salary, department_id)
VALUES  ('Stocker', 26000, 1),
        ('Baker' 32000, 2),
        ('Wrapper', 29000, 2),
        ('Cutter', 43000, 3),
        ('Rotisserie', 32000, 4),
        ('Manager', 65000, 4)

-- Initialize 10 employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Greg', 'Gregson', 3, 3),
        ('Jim', 'Jenson' 1, null),
        ('Blake', 'Blakeson', 6, null),
        ('Tanner', 'Kothlow', 5, 3),
        ('Zoe', 'Kothlow', 4, 3),
        ('Alex', 'Soltero', 4, 4),
        ('Maddie', 'Mewo', 2, null),
        ('Diego', 'Grill', 2, null),
        ('Doug', 'Douglas', 1, null)