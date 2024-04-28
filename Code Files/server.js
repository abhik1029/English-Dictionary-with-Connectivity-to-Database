const express = require("express");
const sendMail = require("./mail");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const log = console.log;
const app = express();
const path = require("path");

const PORT = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "views")));

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/dic", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dic.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.post("/email", (req, res) => {
  const { subject, email, text } = req.body;
  console.log("Data: ", req.body);

  sendMail(email, subject, text, function (err, data) {
    if (err) {
      res.status(500).json({ message: "Internal Error" });
    } else {
      res.json({ message: "Email Sent!!!!" });
    }
  });
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Abhi2003",
  database: "dictionary",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.post("/submit", (req, res) => {
  const firstName = req.body["First_Name"];
  const lastName = req.body["Last_Name"];
  const email = req.body["Contact_Info"];
  const password = req.body["User_Password"];
  const dob = req.body["DOB"];
  const query =
    "INSERT INTO Users (First_Name, Last_Name, Contact_Info, User_Password, DOB) VALUES (?,?,?,?,?)";
  connection.query(
    query,
    [firstName, lastName, email, password, dob],
    (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        return;
      }
      console.log("User inserted successfully");
      res.redirect("/");
    }
  );
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/login", (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];
  const query = "INSERT INTO login (username, password) VALUES (?,?)";
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).send("Error inserting user");
    }
    console.log("User registered successfully");
    res.redirect("/login");
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dic.html"));
});

app.post("/search", (req, res) => {
  const word = req.body["word"];
  const query = "INSERT INTO searchWord (word) VALUES (?)";
  connection.query(query, [word], (err, results) => {
    if (err) {
      console.error("Error inserting word:", err);
      return res.status(500).json({ error: "Error inserting word" });
    }
    console.log("Word inserted successfully:", word);
    res.sendStatus(200); // Send success response
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(PORT, () => log("Server is starting on PORT:", PORT));
