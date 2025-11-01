show tables;
create table user(
    id varchar(40) primary key,
    username varchar(39) unique,
    email varchar(39) not null unique,
    password varchar(39) not null
);