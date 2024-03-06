const express = require("express");
const mysql = require("mysql");
const app = express();
const path = require("path");
const shoplist = require("./routes/shoplist");
const fconf = require("./routes/fconf");
const fridge = require("./routes/fridge");
const home = require("./routes/home");
const recipes = require("./routes/recipes");

//Description : Set the port number for the server
const port = 5000;

//Description : Middleware to handle CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//Description : Middleware to parse JSON and URL-encoded data in requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tooyen",
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.log("Error connecting to DB", err);
    return;
  }
  console.log("MySQL DB successfully connected");
});

//Description : Serve static files from the "img" directory
app.use(express.static(path.join(__dirname, "img")));

//Description : Use defined routes for specific endpoints
app.use("/shoplist", shoplist);
app.use("/fconf", fconf);
app.use("/fridge", fridge);
app.use("/home", home);
app.use("/recipes", recipes);

//Description : Define a test route for the root endpoint
app.get("/", (req, res) => {
  console.log("Test route server.js accessed");
  res.json({ message: "server.js is working" });
});

//Description : Middleware to handle 404 (Not Found) errors
app.use(function (req, res) {
  res.status(404).send("404 Error: Resource not found");
});

//Description : Start the server and listen on the specified port (Port 5000)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
