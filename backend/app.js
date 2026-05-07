require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

let db;

const connectDB = () => {

  db = mysql.createConnection({

    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE

  });

  db.connect((err) => {

    if (err) {

      console.log("DB not ready, retrying in 5 sec...");
      setTimeout(connectDB, 5000);

    } else {

      console.log("Connected to MySQL");

    }

  });

};

connectDB();

app.get("/", (req, res) => {
  res.send("Employee Backend Running");
});

app.post("/employees", (req, res) => {

  const { name, email, department, salary } = req.body;

  const query =
    "INSERT INTO employees (name, email, department, salary) VALUES (?, ?, ?, ?)";

  db.query(query, [name, email, department, salary], (err, result) => {

    if (err) {

      console.log(err);
      return res.status(500).send("DB Error");

    }

    res.send("Employee Added");

  });

});

app.get("/employees", (req, res) => {

  db.query("SELECT * FROM employees", (err, results) => {

    if (err) {

      return res.status(500).send("DB Error");

    }

    res.json(results);

  });

});

app.listen(process.env.PORT, () => {

  console.log(`Backend running on port ${process.env.PORT}`);

});
