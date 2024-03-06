// routes.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const path = require("path");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tooyen",
});

//SQL Connection
connection.connect((err) => {
  if (err) {
    return;
  }
});

let cartID = null; //global cartID

//Description : This function using for finding present cart ID
function FindCartID(callback) {
  const query = `SELECT Cart_ID FROM shop_cart WHERE Cart_Status = "Pending";`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      callback(error, null);
    } else {
      if (results.length > 0) {
        cartID = results[0].Cart_ID; // Update the global cartID
        callback(null, cartID);
      } else {
        console.error('Cart with status "Pending" not found');
        callback("Cart not found", null);
      }
    }
  });
}

//Description : This find current Cart_ID
FindCartID((cartError, retrievedCartID) => {
  if (cartError) {
    console.error("Error:", cartError);
  } else {
    cartID = retrievedCartID;
    console.log("Cart_ID:", cartID);
  }
});

//Description : This APIfetching items by user search word
router.get("/searchItem", (req, res) => {
  const searchWord = req.query.searchWord;

  if (!searchWord) {
    return res.status(200).json({ items: [] });
  }

  const searchSql = `
    SELECT i.Item_Name, i.Item_ID, i.Last_Purchase, i.Tag_ID, tag.Tag_Name 
    FROM item_information i 
    INNER JOIN tag ON i.Tag_ID = tag.Tag_ID 
    WHERE Item_Name LIKE ? `;

  connection.query(searchSql, [searchWord + "%"], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length > 0) {
        const itemInfoArray = results.map((item) => ({
          Item_Name: item.Item_Name,
          Item_ID: item.Item_ID,
          Tag_ID: item.Tag_ID,
          Img_Dir: item.Item_Name.replace(/\s+/g, "").toLowerCase() + ".png",
          Tag_Name: item.Tag_Name,
          Last_Purchase: item.Last_Purchase,
        }));
        res.status(200).json({ items: itemInfoArray });
      } else {
        res
          .status(404)
          .json({ message: `No items found that start with "${searchWord}"` });
      }
    }
  });
});

//Top Modified on 2 December
//Description : This API adds item to the list
router.post("/addToList/:Item_Name/:Qty", (req, res) => {
  const Item_Name = req.params.Item_Name;
  const Qty = req.params.Qty;

  const getItemIDQuery =
    "SELECT Item_ID FROM item_information WHERE Item_Name = ?";

  connection.query(getItemIDQuery, [Item_Name], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length > 0) {
        const Item_ID = results[0].Item_ID;

        const addToList = `
  INSERT INTO shop_list (Cart_ID, Item_ID, Qty, Status)
  VALUES (?, ?, ?, 'Pending')
  ON DUPLICATE KEY UPDATE
  Qty = CASE
    WHEN Status = 'Pending' THEN Qty + VALUES(Qty)
    WHEN Status = 'Canceled' THEN VALUES(Qty)
  END,
  Status = CASE
    WHEN Status = 'Canceled' THEN 'Pending'
    ELSE 'Pending'
  END`;

        connection.query(addToList, [cartID, Item_ID, Qty], (error) => {
          if (error) {
            console.error("Error:", error.message);
            res.status(500).json({ error: "Internal server error" });
          } else {
            res.status(200).json({
              message: "Item added to the shopping list successfully",
            });
          }
        });
      } else {
        res
          .status(404)
          .json({ error: "Item not found in the item_information table" });
      }
    }
  });
});

//Description : This API adds new/unknown item to the database
router.post("/addNewItem", (req, res) => {
  const InputWord = req.body.InputWord;
  const Tag_Name = req.body.Tag_Name;

  //Query to find Tag_ID from Tag_Name in the tag table
  const selectTagIdQuery = "SELECT Tag_ID FROM tag WHERE Tag_Name = ?";

  connection.query(
    selectTagIdQuery,
    [Tag_Name],
    (selectError, selectResults) => {
      if (selectError) {
        console.error("Error finding Tag_ID:", selectError);
        res.status(500).send("Error finding Tag_ID");
      } else {
        if (selectResults.length > 0) {
          const Tag_ID = selectResults[0].Tag_ID;

          //Check if the Item_Name already exists in item_information
          const checkItemExistenceQuery =
            "SELECT COUNT(*) AS count FROM item_information WHERE Item_Name = ?";

          connection.query(
            checkItemExistenceQuery,
            [InputWord],
            (checkError, checkResults) => {
              if (checkError) {
                console.error("Error checking item existence:", checkError);
                res.status(500).send("Error checking item existence");
              } else {
                const itemExists = checkResults[0].count > 0;

                if (itemExists) {
                  res.status(409).json({
                    message: "Item_Name already exists in item_information",
                  });
                } else {
                  const insertTableItemQuery =
                    "INSERT INTO item_information (Item_Name, Tag_ID) VALUES (?, ?)";

                  connection.query(
                    insertTableItemQuery,
                    [InputWord, Tag_ID],
                    (insertError, insertResults) => {
                      if (insertError) {
                        console.error(
                          "Error inserting item into item_information:",
                          insertError
                        );
                        res
                          .status(500)
                          .send("Error inserting item into item_information");
                      } else {
                        res.status(200).json({
                          message:
                            "Item added to item_information successfully",
                        });
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          res.status(404).send("Tag not found");
        }
      }
    }
  );
});

//Description : This API fetching all item in shop_list where status is pending
router.get("/itemInList", (req, res) => {
  const status = "Pending";

  const query = `
    SELECT si.Item_ID, ii.Item_Name, si.Qty, 
      COALESCE((SELECT SUM(fridge.Quantity) FROM item_in_fridge fridge WHERE fridge.Item_ID = si.Item_ID), 0) AS InCart
    FROM shop_list si
    INNER JOIN item_information ii ON si.Item_ID = ii.Item_ID
    WHERE si.Cart_ID = ? AND si.Status = ?;`;

  connection.query(query, [cartID, status], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const cartItems = results.map((result) => {
        return {
          Item_ID: result.Item_ID,
          Item_Name: result.Item_Name,
          Img_Dir: result.Item_Name + ".jpg",
          Item_Status: status, // Set the status to 'Pending'
          Qty: result.Qty,
          InCart: result.InCart,
        };
      });

      res.status(200).json({ cartItems });
    }
  });
});

//Top Modified on 2 December
//Description : This API canceled an item from the shopping list
router.put("/canceledItem/:itemID", (req, res) => {
  const itemID = req.params.itemID;
  const query = `
  UPDATE shop_list
  SET Status = 'Canceled'
  WHERE Cart_ID = ? AND Item_ID = ?;`;

  connection.query(query, [cartID, itemID], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Item canceled from shopping list successfully" });
      } else {
        res
          .status(404)
          .json({ message: `Item not found in Cart ID "${cartID}"` });
      }
    }
  });
});

//Top Modified on 2 December
//Description : This API remove all items from the shopping list
router.delete("/removedItems", (req, res) => {
  const query = `DELETE FROM shop_list WHERE Cart_ID = ? AND Status = "Pending"`;

  connection.query(query, [cartID], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.affectedRows > 0) {
        res.status(200).json({
          message: "All items removed from the shopping list successfully",
        });
      } else {
        res
          .status(200)
          .json({ message: "No items to remove from the shopping list" });
      }
    }
  });
});

//Description : This API updates item's quantity both increase and decrease
router.put("/updateQty", (req, res) => {
  const { itemID, newQuantity } = req.body;

  const query = "UPDATE shop_list SET Qty = ? WHERE Item_ID = ?";

  connection.query(query, [newQuantity, itemID], (error, results) => {
    if (error) {
      console.error("Error updating quantity:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "Quantity updated successfully" });
      } else {
        res.status(404).json({ error: "Item not found in the shopping list" });
      }
    }
  });
});

//Top Modified on 9 November
//Description : This function to insert a single item into the fridge
function insertItemToFridge(item) {
  return new Promise((resolve, reject) => {
    const { itemName, Loc_Num, Set_Dur, Quantity } = item;

    //Find Item_ID using itemName
    connection.query(
      "SELECT Item_ID FROM item_information WHERE Item_Name = ?",
      [itemName],
      (itemQueryError, itemResult) => {
        if (itemQueryError) {
          reject(itemQueryError);
          return;
        }

        if (itemResult.length === 0) {
          //Item not found
          reject(new Error("Item not found"));
          return;
        }

        const itemID = itemResult[0].Item_ID;

        //Find Loc_ID using Loc_Num
        connection.query(
          "SELECT Loc_ID FROM location WHERE Loc_Num = ?",
          [Loc_Num],
          (locQueryError, locResult) => {
            if (locQueryError) {
              reject(locQueryError);
              return;
            }

            if (locResult.length === 0) {
              //Location not found
              reject(new Error("Location not found"));
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
                  reject(insertError);
                } else {
                  //Update Last_Purchase in item_information table with current timestamp
                  const updateLastPurchaseQuery = `
                    UPDATE item_information 
                    SET Last_Purchase = NOW()
                    WHERE Item_ID = ?`;

                  connection.query(
                    updateLastPurchaseQuery,
                    [itemID],
                    (updateError) => {
                      if (updateError) {
                        reject(updateError);
                      } else {
                        resolve();
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
}

//Description : This API endpoint is for inserting items
router.post("/insertToFridge", (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Invalid or empty item array" });
    return;
  }

  Promise.all(items.map(insertItemToFridge))
    .then(() => {
      const itemNames = items.map((item) => item.itemName);

      const findItemIDsQuery = `
    SELECT Item_ID
    FROM item_information
    WHERE Item_Name IN (?)`;

      connection.query(
        findItemIDsQuery,
        [itemNames],
        (findItemIDsError, findItemIDsResult) => {
          if (findItemIDsError) {
            console.error("Error finding Item_IDs:", findItemIDsError.message);
            res.status(500).json({ error: "Error finding Item_IDs" });
            return;
          }

          const itemIDs = findItemIDsResult.map((result) => result.Item_ID);

          const updateStatusQuery = `
      UPDATE shop_list
      SET status = 'Confirmed'
      WHERE Cart_ID = ? AND Item_ID IN (?)`;

          connection.query(
            updateStatusQuery,
            [cartID, itemIDs],
            (updateStatusError, updateStatusResult) => {
              if (updateStatusError) {
                console.error(
                  "Error updating status:",
                  updateStatusError.message
                );
                res.status(500).json({ error: "Error updating status" });
              } else {
                res
                  .status(200)
                  .json({ message: "Items added to the fridge successfully" });
              }
            }
          );
        }
      );
    })
    .catch((error) => {
      console.error("Error adding items to the fridge:", error.message);
      res.status(500).json({ error: "Internal server error" });
    });
});

//Top Modified on 25 Novemver
//Description : This API ensures that status of items that are not selected after call this API is canceled and item that selected are marked as completed
router.put("/done", (req, res) => {
  if (cartID) {
    const updateCartStatusQuery = `
      UPDATE shop_cart
      SET Cart_Status = 'Completed', Finish_Date = NOW()
      WHERE Cart_ID = ?`;

    connection.query(
      updateCartStatusQuery,
      [cartID],
      (cartStatusError, cartStatusResults) => {
        if (cartStatusError) {
          console.error("Error updating cart status:", cartStatusError.message);
          res.status(500).json({ error: "Internal server error" });
        } else {
          //Change the status of items in the cart where Cart_ID is equal to the current cartID and Status is "Pending" to "Canceled"
          const cancelItemsQuery = `
          UPDATE shop_list
          SET Status = 'Canceled'
          WHERE Cart_ID = ? AND Status = 'Pending'`;

          connection.query(
            cancelItemsQuery,
            [cartID],
            (cancelItemsError, cancelItemsResults) => {
              if (cancelItemsError) {
                console.error(
                  "Error canceling items in the cart:",
                  cancelItemsError.message
                );
                res.status(500).json({ error: "Internal server error" });
              } else {
                //Create a new cart by inserting new Cart_Status as "Pending"
                const createNewCartQuery = `
              INSERT INTO shop_cart (Cart_Status)
              VALUES ('Pending')`;

                connection.query(
                  createNewCartQuery,
                  (createNewCartError, createNewCartResults) => {
                    if (createNewCartError) {
                      console.error(
                        "Error creating a new cart:",
                        createNewCartError.message
                      );
                      res.status(500).json({ error: "Internal server error" });
                    } else {
                      //Update the global cartID variable with the retrieved Cart_ID
                      FindCartID((findCartError, retrievedCartID) => {
                        if (findCartError) {
                          console.error("Error:", findCartError);

                          res
                            .status(500)
                            .json({ error: "Error finding new cart ID" });
                        } else {
                          cartID = retrievedCartID;
                          console.log("Cart_ID:", cartID);

                          res
                            .status(200)
                            .json({ message: "Cart completed successfully" });
                        }
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } else {
    res.status(500).json({ error: "Cart ID not available" });
  }
});

//Top Modified on 2 December
//Description : This API fetching suggested item
router.get("/suggestedItem", (req, res) => {
  const searchSql = `
    SELECT i.Item_Name, i.Item_ID, i.Tag_ID, tag.Tag_Name, i.Last_Purchase
    FROM item_information i
    INNER JOIN tag ON i.Tag_ID = tag.Tag_ID
    INNER JOIN shop_list sl ON i.Item_ID = sl.Item_ID
    LEFT JOIN item_in_fridge ii ON i.Item_ID = ii.Item_ID
    WHERE sl.Cart_ID != ? AND ii.Item_ID IS NULL;
  `;

  connection.query(searchSql, [cartID], (error, results) => {
    if (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      //Use a Set to ensure unique items based on Item_ID
      const uniqueItems = new Set();
      results.forEach((item) => {
        uniqueItems.add(item.Item_ID);
      });

      //Convert the Set back to an array of unique items
      const uniqueItemInfoArray = Array.from(uniqueItems).map(
        (uniqueItemId) => {
          const matchingItem = results.find(
            (item) => item.Item_ID === uniqueItemId
          );
          return {
            Item_Name: matchingItem.Item_Name,
            Item_ID: matchingItem.Item_ID,
            Tag_ID: matchingItem.Tag_ID,
            Img_Dir: matchingItem.Item_Name.toLowerCase() + ".jpg",
            Tag_Name: matchingItem.Tag_Name,
            Last_Purchase: matchingItem.Last_Purchase,
          };
        }
      );

      res.status(200).json({ items: uniqueItemInfoArray });
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
