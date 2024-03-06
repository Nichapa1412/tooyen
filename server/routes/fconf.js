const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tooyen",
});

//SQL Connection
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to DB", err);
    return;
  }
});

//Description : This API fetch temperature from database
router.get("/fetchTemp", (req, res) => {
  const query = "SELECT Temp FROM fridge_config";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching temperature data:", error);
      res.status(500).json({ error: "Error fetching temperature data" });
    } else {
      const temperatureData = results.map((result) => result.Temp);

      res.json({ temperatureData });
    }
  });
});

//Description : This API fetch user information including username and email
router.get("/fetchUser", (req, res) => {
  const query = "SELECT Username, Email FROM fridge_config";

  connection.query(query, (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: `Error fetching user data: ${error.message}` });
    } else {
      const userData = results.map((result) => ({
        UserName: result.Username,
        UserEmail: result.Email,
      }));

      res.json(userData);
    }
  });
});

//Top Modified 30 November
//Description : This API update user's profile information
router.put("/updateProfile", (req, res) => {
  const { Username, Email, Initial_datetime, Temp } = req.body;

  let updateQuery = "UPDATE fridge_config SET";

  if (Username) updateQuery += ` Username = ?,`;
  if (Email) updateQuery += ` Email = ?,`;
  if (Initial_datetime) updateQuery += ` Initial_datetime = ?,`;
  if (Temp) updateQuery += ` Temp = ?,`;

  updateQuery = updateQuery.slice(0, -1);

  const values = [];
  if (Username) values.push(Username);
  if (Email) values.push(Email);
  if (Initial_datetime) values.push(Initial_datetime);
  if (Temp) values.push(Temp);

  connection.query(updateQuery, values, (updateError, updateResults) => {
    if (updateError) {
      console.error("Error updating profile:", updateError);
      res.status(500).json({ error: "Error updating profile" });
    } else {
      res.json({ message: "Profile updated successfully" });
    }
  });
});

//Top Modified 5 December
//Description : This APi fetch all items in cart history where status "Completed"
router.get("/allCartHistory", (req, res) => {
  const getCompletedCartIdsSql =
    'SELECT Cart_ID FROM Shop_Cart WHERE Cart_Status = "Completed"';

  connection.query(getCompletedCartIdsSql, (error, results) => {
    if (error) {
      console.error(
        "Error executing SQL query to get completed Cart_IDs: " + error
      );
      res.status(500).send("An error occurred.");
    } else {
      if (results.length === 0) {
        res.json([]);
      } else {
        const completedCartIds = results.map((result) => result.Cart_ID);

        const getItemsSql = `
        SELECT sl.Cart_ID, i.Item_Name, sl.Qty, sl.Status, sc.Finish_Date
        FROM shop_list sl
        INNER JOIN item_information i ON sl.Item_ID = i.Item_ID
        INNER JOIN shop_cart sc ON sl.Cart_ID = sc.Cart_ID
        WHERE sl.Cart_ID IN (?)
      `;

        connection.query(
          getItemsSql,
          [completedCartIds],
          (itemsError, itemsResults) => {
            if (itemsError) {
              console.error(
                "Error executing SQL query to get items: " + itemsError
              );
              res.status(500).send("An error occurred.");
            } else {
              res.json(itemsResults);
            }
          }
        );
      }
    }
  });
});

//Error handling middleware
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

//Export the router
module.exports = router;
