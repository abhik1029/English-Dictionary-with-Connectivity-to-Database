CREATE DATABASE dictionary;
USE dictionary;

CREATE TABLE Users (
    First_Name VARCHAR(30) NOT NULL,
    Last_Name VARCHAR(30) NOT NULL,
    Contact_Info VARCHAR(50) NOT NULL,
    User_Password VARCHAR(64) NOT NULL, 
    DOB DATE
);

CREATE TABLE Dictionary (
Word VARCHAR(50) NOT NULL,
Meaning TEXT NOT NULL,
Example TEXT
);

CREATE TABLE searchword(
id INT AUTO_INCREMENT PRIMARY KEY,
word VARCHAR(255) NOT NULL
);

CREATE TABLE Login(
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL,
password VARCHAR(50) NOT NULL
);



SELECT * FROM Users;
SELECT * FROM login;
SELECT * FROM dictionary;
SELECT * FROM searchword;




ALTER USER 'root'@'localhost' identified with mysql_native_password by '@Abhi2003';

