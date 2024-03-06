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

let cartID = null; //Declare cartID as a global

//Description : This function using for finding present cart ID
function FindCartID(callback) {
  const query = `SELECT Cart_ID FROM shop_cart WHERE Cart_Status = "Pending";`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      callback(error, null);
    } else {
      if (results.length > 0) {
        cartID = results[0].Cart_ID;

        callback(null, cartID);
      } else {
        console.error('Cart with status "Pending" not found');
        callback("Cart not found", null);
      }
    }
  });
}

//Top Modified 26 November
//Description : This API finds current Cart_ID
FindCartID((cartError, retrievedCartID) => {
  if (cartError) {
    console.error("Error:", cartError);
  } else {
    cartID = retrievedCartID;
  }
});

//Description : This API fetching items that is already expires
router.get("/fetchItemExpires", (req, res) => {
  const currentDate = new Date();

  const fetchQuery = `
      SELECT
        item_in_fridge.Item_ID,
        item_information.Item_Name,
        item_in_fridge.Add_Date,
        item_in_fridge.Ex_Date,
        location.Loc_Num
      FROM
        item_in_fridge
      JOIN
        item_information ON item_in_fridge.Item_ID = item_information.Item_ID
      JOIN
        location ON item_in_fridge.Loc_ID = location.Loc_ID
      WHERE
        item_in_fridge.Ex_Date IS NOT NULL AND item_in_fridge.Ex_Date < ?`;

  connection.query(fetchQuery, [currentDate], (error, results) => {
    if (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Internal server error in item fetch" });
    } else {
      const expiringItems = results.map((item) => ({
        Item_ID: item.Item_ID,
        Item_Name: item.Item_Name,
        Add_Date: item.Add_Date,
        Ex_Date: item.Ex_Date,
        Loc_Num: item.Loc_Num,
      }));

      res.status(200).json({ items: expiringItems });
    }
  });
});

//Top Modified 1 December
//Description : This API endpoint is for inserting a single item
router.post("/insertInstant", (req, res) => {
  const item = req.body;

  if (!item) {
    res.status(400).json({ error: "Invalid or empty item" });
    return;
  }

  const { itemName, Loc_Num, Set_Dur, Quantity } = item;

  FindCartID((cartError, retrievedCartID) => {
    if (cartError) {
      console.error("Error:", cartError);
      res.status(500).json({ error: "Error finding Cart_ID" });
      return;
    }

    //Set the retrieved cartID as the global cartID
    cartID = retrievedCartID;

    //Find Item_ID using itemName
    connection.query(
      "SELECT Item_ID FROM item_information WHERE Item_Name = ?",
      [itemName],
      (itemQueryError, itemResult) => {
        if (itemQueryError) {
          console.error("Error finding Item_ID:", itemQueryError.message);
          res.status(500).json({ error: "Error finding Item_ID" });
          return;
        }

        if (itemResult.length === 0) {
          res.status(404).json({ error: "Item not found" });
          return;
        }

        const itemID = itemResult[0].Item_ID;

        //Find Loc_ID using Loc_Num
        connection.query(
          "SELECT Loc_ID FROM location WHERE Loc_Num = ?",
          [Loc_Num],
          (locQueryError, locResult) => {
            if (locQueryError) {
              console.error("Error finding Loc_ID:", locQueryError.message);
              res.status(500).json({ error: "Error finding Loc_ID" });
              return;
            }

            if (locResult.length === 0) {
              //Location not found
              res.status(404).json({ error: "Location not found" });
              return;
            }

            const locID = locResult[0].Loc_ID;
            const Add_Date = new Date();
            const Ex_Date = new Date(Add_Date);
            Ex_Date.setDate(Add_Date.getDate() + Set_Dur);

            //Insert the item into the fridge directly
            const insertQuery = `
            INSERT INTO item_in_fridge (Item_ID, Cart_ID, Loc_ID, Set_Dur, Quantity, Add_Date, Ex_Date)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

            connection.query(
              insertQuery,
              [itemID, cartID, locID, Set_Dur, Quantity, Add_Date, Ex_Date],
              (insertError) => {
                if (insertError) {
                  console.error("Error inserting item:", insertError.message);
                  res.status(500).json({ error: "Error inserting item" });
                } else {
                  //Update Last_Purchase in item_information table with the current timestamp
                  const updateLastPurchaseQuery = `
                  UPDATE item_information 
                  SET Last_Purchase = NOW()
                  WHERE Item_ID = ?`;

                  connection.query(
                    updateLastPurchaseQuery,
                    [itemID],
                    (updateError) => {
                      if (updateError) {
                        console.error(
                          "Error updating Last_Purchase:",
                          updateError.message
                        );
                        res
                          .status(500)
                          .json({ error: "Error updating Last_Purchase" });
                      } else {
                        res.status(200).json({
                          message: "Item added to the fridge successfully",
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        );
      }
    );
  });
});

//Top Modified 1 December
//Description : This API fetch item in the fridge by a specific category
router.get("/itemInFridge", (req, res) => {
  const Category = req.query.Category;

  let selectSql = `
    SELECT i.Inv_ID, i.Item_ID, i.Cart_ID, i.Set_Dur, l.Loc_Num, i.Quantity, i.Add_Date, i.Ex_Date, ii.Item_Name, t.Tag_Name
    FROM item_in_fridge i
    INNER JOIN item_information ii ON i.Item_ID = ii.Item_ID
    INNER JOIN Tag t ON ii.Tag_ID = t.Tag_ID
    INNER JOIN Location l ON i.Loc_ID = l.Loc_ID`;

  if (Category) {
    selectSql += ` WHERE t.Tag_Name = ?`;
  }

  selectSql += `
    ORDER BY ii.Item_Name, i.Ex_Date ASC;`;

  connection.query(selectSql, [Category], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length > 0) {
        res.status(200).json({ items: results });
      } else {
        res.status(404).json({ message: "No items found in the fridge" });
      }
    }
  });
});

//Top Modified 8 November
//Description : This API fetch all item in the fridge
router.get("/itemInFridgeAll", (req, res) => {
  const Category = req.query.Category;

  let selectSql = `
    SELECT i.Item_ID, i.Cart_ID, i.Set_Dur, l.Loc_Num, i.Quantity, i.Add_Date, i.Ex_Date, ii.Item_Name, t.Tag_Name
    FROM item_in_fridge i
    INNER JOIN item_information ii ON i.Item_ID = ii.Item_ID
    INNER JOIN Tag t ON ii.Tag_ID = t.Tag_ID
    INNER JOIN Location l ON i.Loc_ID = l.Loc_ID`;

  if (Category) {
    selectSql += ` WHERE t.Tag_Name= ?`;
  }

  connection.query(selectSql, [Category], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length > 0) {
        const itemInfoArray = results.map((item) => ({
          Item_Name: item.Item_Name,
          Cart_ID: item.Cart_ID,
          Item_ID: item.Item_ID,
          Category: item.Tag_Name,
          Loc_Num: item.Loc_Num,
          Quantity: item.Quantity,
          Add_Date: item.Add_Date,
          Ex_Date: item.Ex_Date,
        }));
        res.status(200).json({ items: itemInfoArray });
      } else {
        res.status(404).json({ message: "No items found in the fridge" });
      }
    }
  });
});

//Description : This API get the item that expire by today, tomorrow, next two days, and next three days
router.get("/itemExpire", (req, res) => {
  const now = new Date();
  now.setSeconds(0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const nextTwo = new Date();
  nextTwo.setDate(nextTwo.getDate() + 2);
  nextTwo.setHours(0, 0, 0, 0);

  const nextThree = new Date();
  nextThree.setDate(nextThree.getDate() + 3);
  nextThree.setHours(0, 0, 0, 0);

  const nextFour = new Date();
  nextFour.setDate(nextFour.getDate() + 4);
  nextFour.setHours(0, 0, 0, 0);

  const expireItemsQuery = `
  SELECT DISTINCT iif.Item_ID, ii.Item_Name, ti.Tag_Name, DATE_ADD(iif.Add_Date, INTERVAL iif.Set_Dur DAY) AS Expiration_Date
  FROM item_in_fridge iif
  INNER JOIN item_information ii ON iif.Item_ID = ii.Item_ID
  LEFT JOIN tag ti ON ii.Tag_ID = ti.Tag_ID
`;

  connection.query(expireItemsQuery, (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const categorizedItems = {
        today: [],
        tomorrow: [],
        nextTwo: [],
        nextThree: [],
      };

      results.forEach((item) => {
        const expirationDate = new Date(item.Expiration_Date);

        const categorizedItem = {
          Item_Name: item.Item_Name,
          Tag_Name: item.Tag_Name,
        };

        if (expirationDate >= today && expirationDate < tomorrow) {
          categorizedItems.today.push(categorizedItem);
        } else if (expirationDate >= tomorrow && expirationDate < nextTwo) {
          categorizedItems.tomorrow.push(categorizedItem);
        } else if (expirationDate >= nextTwo && expirationDate < nextThree) {
          categorizedItems.nextTwo.push(categorizedItem);
        } else if (expirationDate >= nextThree && expirationDate < nextFour) {
          categorizedItems.nextThree.push(categorizedItem);
        }
      });

      res.status(200).json(categorizedItems);
    }
  });
});

//Description : This API to subtract item quantity and if quantity = 0, the item will be remove
router.put("/changeItemInStock/:Inv_ID/:Quantity", (req, res) => {
  const itemInv = req.params.Inv_ID;
  const quantityToSubtract = parseInt(req.params.Quantity, 10);

  const selectQuery = `
    SELECT Quantity
    FROM item_in_fridge
    WHERE Inv_ID = ?;
  `;

  connection.query(selectQuery, [itemInv], (selectError, selectResults) => {
    if (selectError) {
      console.error("Error retrieving current quantity:", selectError);
      res.status(500).send("Internal Server Error");
    } else {
      const currentQuantity = selectResults[0].Quantity;
      const newQuantity = currentQuantity - quantityToSubtract;

      //Update the quantity in the database
      const updateQuery = `
        UPDATE item_in_fridge
        SET Quantity = ?
        WHERE Inv_ID = ?;
      `;

      connection.query(
        updateQuery,
        [newQuantity, itemInv],
        (updateError, updateResults) => {
          if (updateError) {
            console.error("Error updating quantity:", updateError);
            res.status(500).send("Internal Server Error");
          } else {
            //If Quantity is zero, remove the item from the database
            if (newQuantity <= 0) {
              const deleteQuery = `
              DELETE FROM item_in_fridge
              WHERE Inv_ID = ?;
            `;

              connection.query(
                deleteQuery,
                [itemInv],
                (deleteError, deleteResults) => {
                  if (deleteError) {
                    console.error("Error deleting item:", deleteError);
                    res.status(500).send("Internal Server Error");
                  } else {
                    res
                      .status(200)
                      .send(
                        "Quantity updated to zero, item removed successfully"
                      );
                  }
                }
              );
            } else {
              res.status(200).send("Quantity updated successfully");
            }
          }
        }
      );
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
