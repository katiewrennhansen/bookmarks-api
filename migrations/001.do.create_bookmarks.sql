--create table
CREATE TABLE bookmark_data (
    id INTEGER primary key generated by default as identity,
    title text NOT NULL,
    url text NOT NULL,
    description text,
    rating INTEGER NOT NULL
);