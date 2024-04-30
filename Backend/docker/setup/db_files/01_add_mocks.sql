insert into system.teacher (id, name, second_name, surname) VALUES
('eb247366-dee4-40dc-8610-122e937d3a21', 'Tomasz', null, 'Kapłon'),
('9b0942c5-1305-4be1-88e3-1b116958a8f7', 'Paweł', 'Krzysztof', 'Głuchowski');

insert into system.course(id, teacher_id, school_year, name) VALUES
('8398f4de-8604-4f61-b8f6-acc861e51eb8', 'eb247366-dee4-40dc-8610-122e937d3a21', 2019, 'Matematyka'),
('f4b3b3b4-4b1b-4b1b-8b1b-4b1b4b1b4b1b', '9b0942c5-1305-4be1-88e3-1b116958a8f7', 2020, 'Fizyka');

insert into system.test(id, course_id, created_by, name) VALUES
('e642be08-3ebe-41e2-b442-0707a11cd168', '8398f4de-8604-4f61-b8f6-acc861e51eb8', '406304', 'Test 1'),
('e7840c8f-0403-480e-87d8-fef94b1b6d75', 'f4b3b3b4-4b1b-4b1b-8b1b-4b1b4b1b4b1b', '406304','Test 2');

insert into system.question(id, body, img_file, test_id) VALUES
('3d268308-cf70-4466-9a90-f08f75223435', 'Jakiego koloru jest sławna honda type r?', null, 'e642be08-3ebe-41e2-b442-0707a11cd168'),
('f71a41ce-10f8-473a-b295-3c5ad0ba3f9c', 'Ile wynosi przyspieszenie ziemskie?', null, 'e7840c8f-0403-480e-87d8-fef94b1b6d75');

insert into system.answer(id, question_id, body, valid) VALUES
('02d888ff-26e1-467a-a675-f72d49074845', '3d268308-cf70-4466-9a90-f08f75223435', 'Niebieski jak letnie niebo', false),
('dfbb5add-4466-49bd-a09f-779f013ddf17', '3d268308-cf70-4466-9a90-f08f75223435', 'Fioletowy jak neony w klubie', false),
('a4ea6c7d-bb03-4f49-b477-2ee7af72926b', '3d268308-cf70-4466-9a90-f08f75223435', 'Czerwony jak ferrari', false),
('9423d3b0-4562-438f-a2eb-e29703585d86', '3d268308-cf70-4466-9a90-f08f75223435', 'Srebrny niczym srebrna strzała', true),
('c00305e4-e8fe-4956-8d99-a6faed6f129c', 'f71a41ce-10f8-473a-b295-3c5ad0ba3f9c', '9.81 m/s^2', true),
('75b724b7-e6e5-4370-b18b-14d88fbe0f8c', 'f71a41ce-10f8-473a-b295-3c5ad0ba3f9c', '9.82 m/s^2', false),
('14f81dc7-0dc2-4792-9252-1060c4446567', 'f71a41ce-10f8-473a-b295-3c5ad0ba3f9c', '9.83 m/s^2', false),
('39149cc8-4c0e-4bd0-b004-5dad311a3bf9', 'f71a41ce-10f8-473a-b295-3c5ad0ba3f9c', '9.84 m/s^2', false);
