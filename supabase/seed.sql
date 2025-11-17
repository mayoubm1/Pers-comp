# update
insert into profiles (id, updated_at, username, avatar_url, website)
values
    (uuid_generate_v4(), now(), 'test_user_1', 'https://avatars.githubusercontent.com/u/12345?v=4', 'https://github.com/test_user_1'),
    (uuid_generate_v4(), now(), 'test_user_2', 'https://avatars.githubusercontent.com/u/67890?v=4', 'https://github.com/test_user_2'),
    (uuid_generate_v4(), now(), 'test_user_3', 'https://avatars.githubusercontent.com/u/112233?v=4', 'https://github.com/test_user_3');

