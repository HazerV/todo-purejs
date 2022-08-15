create table users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) unique,
    password VARCHAR(255)
);

create table todos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    is_done BOOLEAN,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- create table orders (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255),
--     date VARCHAR(255),
--     status VARCHAR(255)
-- );