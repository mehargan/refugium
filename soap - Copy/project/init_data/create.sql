DROP TABLE IF EXISTS refugees CASCADE;
DROP TABLE IF EXISTS hosts CASCADE;
CREATE TABLE IF NOT EXISTS refugees (
  ID SERIAL PRIMARY KEY,
  username VARCHAR(30) NOT NULL,       
  email VARCHAR(30) NOT NULL,
  userPassword VARCHAR(100) NOT NULL,
  house_image VARCHAR(500),
  house_description VARCHAR(500),
  dates_available VARCHAR(1000),
  home_address VARCHAR(200)
);
CREATE TABLE IF NOT EXISTS hosts (
  ID SERIAL PRIMARY KEY,
  username VARCHAR(30) NOT NULL,       
  email VARCHAR(30) NOT NULL,
  userPassword VARCHAR(100) NOT NULL,
  house_image VARCHAR(500),
  house_description VARCHAR(500),
  dates_available VARCHAR(1000),
  home_address VARCHAR(200)
);

INSERT INTO refugees (username, email, userPassword, house_image, house_description, dates_available, home_address)
 VALUES ('testuserrefugee', 'email', 'password', 'sample_image_url', 'sample house description', '12/30,12/31', '111 street');

INSERT INTO hosts (username, email, userPassword, house_image, house_description, dates_available, home_address) 
VALUES ('testuserhost', 'email', 'password', 'https://a0.muscache.com/im/pictures/fde4eb29-bf9f-4f7f-89e4-5e74096956d0.jpg?im_w=720', 'sample house description', '12/30,12/31', '112 street');

INSERT INTO hosts (username, email, userPassword, house_image, house_description, dates_available, home_address) 
VALUES ('testuserhost2', 'email', 'password', 'https://a0.muscache.com/im/pictures/fde4eb29-bf9f-4f7f-89e4-5e74096956d0.jpg?im_w=720', 'sample house 2 description', '1/30,2/15', '224 street');