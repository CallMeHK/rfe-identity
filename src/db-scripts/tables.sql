CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   TEXT UNIQUE,
  email      TEXT UNIQUE,
  password   TEXT NOT NULL,
	active		 BOOLEAN 
);

