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

//Top Modified 1 December
//Description : This API using for searching the items in fridge
router.get("/searchFridge", (req, res) => {
  const searchWord = req.query.searchWord;

  const searchSql = `
    SELECT i.Item_ID, i.Set_Dur, i.Loc_ID, i.Quantity, i.Add_Date, ii.Item_Name
    FROM item_in_fridge i
    INNER JOIN item_information ii ON i.Item_ID = ii.Item_ID
    WHERE ii.Item_Name LIKE ?`;

  connection.query(searchSql, [searchWord + "%"], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length > 0) {
        const itemInfoArray = results.map((item) => ({
          Item_Name: item.Item_Name,
          Item_ID: item.Item_ID,
          Set_Dur: item.Set_Dur,
          Loc_ID: item.Loc_ID,
          Quantity: item.Quantity,
          Add_Date: item.Add_Date,
        }));
        res.status(200).json({ items: itemInfoArray });
      } else {
        res.status(404).json({
          message: `No items found in the fridge that start with "${searchWord}"`,
        });
      }
    }
  });
});

//Description : This API remove item from fridge using Item_ID
router.post("/removeFromFridge/:itemID", (req, res) => {
  const itemID = req.params.itemID;

  const deleteQuery = "DELETE FROM item_in_fridge WHERE Item_ID = ?";

  connection.query(deleteQuery, [itemID], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Item removed from the fridge successfully" });
      } else {
        res.status(404).json({ message: "Item not found in the fridge" });
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
