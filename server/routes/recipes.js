const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const ROUTE_SEARCH_INGREDIENTS = "/searchIngredients/:query";
const ROUTE_ADD_RECIPE = "/addRecipe";
const ROUTE_FETCH_ALL_INGREDIENT = "/fetchAllIngredients";
const ROUTE_RESET_RECIPES = "/resetRecipes";
const ROUTE_FETCH_ALL_RECIPES_WITH_INGREDIENTS =
  "/fetchAllRecipesWithIngredients";
const ROUTE_FETCH_RECIPE_DETAIL = "/fetchRecipeDetails/:recipeID";
const ROUTE_UPDATE_COOK = "/updateIngredientQuantities";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tooyen",
});

//SQL Connection
connection.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to the database");
});

//Website Modified 18 November
//Description : This function find recipe ID
function FindRecipeID() {
  return new Promise((resolve, reject) => {
    const query = `SELECT MAX(Recipe_ID) AS LatestRecipeID FROM recipe_book`;

    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error:", error.message);
        reject(error);
      } else {
        if (results.length > 0) {
          const recipeID = results[0].LatestRecipeID;
          resolve(recipeID);
        } else {
          console.error("Failed");
          reject("Failed");
        }
      }
    });
  });
}

//Website Modified 1 December
//Description : This API fetch all ingredients
router.get(ROUTE_FETCH_ALL_INGREDIENT, (req, res) => {
  const query = "SELECT Item_ID, Item_Name FROM item_information";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching all ingredients:", error);
      return res
        .status(500)
        .json({ message: "Error fetching all ingredients" });
    }

    res.status(200).json(results);
  });
});

//Description : This API fetching ingredents corresponding to search term
router.get(ROUTE_SEARCH_INGREDIENTS, (req, res) => {
  const searchTerm = req.params.query;

  const query =
    "SELECT Item_ID, Item_Name FROM item_information WHERE Item_Name LIKE ?";
  const searchValue = `${searchTerm}%`;

  connection.query(query, [searchValue], (error, results) => {
    if (error) {
      console.error("Error searching ingredients:", error);
      return res.status(500).json({ message: "Error searching ingredients" });
    }

    res.status(200).json(results);
  });
});

//Website Modified 10 Nov
//Description : This API adds new recipe to database
router.post(ROUTE_ADD_RECIPE, async (req, res) => {
  const { Recipe_Name, Country, Difficulty, Ingredients_List } = req.body;

  if (!Recipe_Name || !Country || Ingredients_List.length === 0) {
    console.error("Please fill in all required fields.");
    return res
      .status(400)
      .json({ error: "Please fill in all required fields." });
  }

  const recipeQuery =
    "INSERT INTO recipe_book (Recipe_Name, Country, Difficulty) VALUES (?, ?, ?)";
  const recipeValues = [Recipe_Name, Country, Difficulty];

  try {
    await queryAsync(recipeQuery, recipeValues);

    const recipeID = await FindRecipeID();

    for (const ingredient of Ingredients_List) {
      const itemQuery =
        "SELECT Item_ID FROM item_information WHERE Item_Name = ?";
      const itemValues = [ingredient.Item_Name];

      try {
        const itemResult = await queryAsync(itemQuery, itemValues);

        if (itemResult && itemResult.length > 0 && itemResult[0].Item_ID) {
          const itemID = itemResult[0].Item_ID;

          const ingredientQuery =
            "INSERT INTO recipe_ing (Recipe_ID, Item_ID, Quantity) VALUES (?, ?, ?)";
          const ingredientValues = [recipeID, itemID, ingredient.Quantity];

          await queryAsync(ingredientQuery, ingredientValues);
        } else {
          console.error(
            "Error processing ingredient: Item not found or missing Item_ID"
          );
          return res.status(500).json({
            message:
              "Error processing ingredient: Item not found or missing Item_ID",
          });
        }
      } catch (error) {
        console.error("Error processing ingredient:", error);
        return res.status(500).json({ message: "Error processing ingredient" });
      }
    }

    res.status(200).json({ message: "Recipe added successfully" });
  } catch (error) {
    console.error("Error inserting recipe:", error);
    return res.status(500).json({ message: "Error inserting recipe" });
  }
});

//Website Modified 1 December
//Description : This API truncate (reset) all recipes
router.post(ROUTE_RESET_RECIPES, async (req, res) => {
  try {
    await queryAsync("DELETE FROM `tooyen`.`recipe_ing`");
    await queryAsync("DELETE FROM `tooyen`.`recipe_book`");
    await queryAsync("TRUNCATE TABLE `tooyen`.`seq__recipe`");
    res.status(200).json({ message: "Reset recipes successfully." });
  } catch (error) {
    console.error("Error resetting recipes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

///Website Modified 29 November
//Description : This API fetching recipe details
router.get(ROUTE_FETCH_RECIPE_DETAIL, async (req, res) => {
  try {
    const recipeID = req.params.recipeID;

    const query = `
			SELECT r.Recipe_ID, r.Recipe_Name, r.Country, r.Difficulty, r.Image, 
						 i.Item_Name, ri.Quantity,
						 IFNULL(SUM(f.Quantity), 0) AS quantityAvail,
						 IFNULL(SUM(f.Quantity) / ri.Quantity, 0) AS servingAvail
			FROM recipe_book r
			LEFT JOIN recipe_ing ri ON r.Recipe_ID = ri.Recipe_ID
			LEFT JOIN item_information i ON ri.Item_ID = i.Item_ID
			LEFT JOIN item_in_fridge f ON i.Item_ID = f.Item_ID AND f.Ex_Date > NOW()
			WHERE r.Recipe_ID = ?
			GROUP BY r.Recipe_ID, i.Item_ID, ri.Quantity
		`;

    const results = await queryAsync(query, [recipeID]);

    if (results && results.length > 0) {
      const recipeDetails = {
        Recipe_ID: results[0].Recipe_ID,
        Recipe_Name: results[0].Recipe_Name,
        Country: results[0].Country,
        Difficulty: results[0].Difficulty,
        Image: results[0].Image,
        Ingredients: results.map((ingredient) => ({
          Item_Name: ingredient.Item_Name,
          Quantity: ingredient.Quantity,
          quantityAvail: ingredient.quantityAvail,
          servingAvail: ingredient.servingAvail,
        })),
      };

      res.status(200).json(recipeDetails);
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    res.status(500).json({ message: "Error fetching recipe details" });
  }
});

//Description : This API updates (subtracts) the quantity of ingredents used in cooking
router.post(ROUTE_UPDATE_COOK, async (req, res) => {
  try {
    const { recipeId, servingsCooked } = req.body;

    if (!recipeId || isNaN(servingsCooked)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const updateIngredientsQuery = `
		UPDATE item_in_fridge AS iif
		JOIN (
				SELECT ri.Item_ID, MIN(iif.Add_Date) AS OldestAddDate, ri.Quantity
				FROM recipe_ing AS ri
				JOIN item_in_fridge AS iif ON ri.Item_ID = iif.Item_ID
				WHERE ri.Recipe_ID = ?
				GROUP BY ri.Item_ID, ri.Quantity
		) AS oldest ON iif.Item_ID = oldest.Item_ID AND iif.Add_Date = oldest.OldestAddDate
		SET iif.Quantity = GREATEST(0, iif.Quantity - (oldest.Quantity * ?))
		WHERE iif.Ex_Date > NOW();
		`;

    const deleteZeroQuantityQuery = `
		DELETE FROM item_in_fridge
		WHERE Quantity <= 0;
		`;

    await queryAsync(updateIngredientsQuery, [recipeId, servingsCooked]);
    await queryAsync(deleteZeroQuantityQuery);

    res
      .status(200)
      .json({ message: "Ingredient quantities updated successfully" });
  } catch (error) {
    console.error("Error updating ingredient quantities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Description : This API fetching all recipe including its ingredients
router.get(ROUTE_FETCH_ALL_RECIPES_WITH_INGREDIENTS, async (req, res) => {
  try {
    const query = `
      SELECT r.Recipe_ID, r.Recipe_Name, r.Country, r.Difficulty, r.Image, 
      GROUP_CONCAT(i.Item_Name) AS Ingredients
      FROM recipe_book r
      LEFT JOIN recipe_ing ri ON r.Recipe_ID = ri.Recipe_ID
      LEFT JOIN item_information i ON ri.Item_ID = i.Item_ID
      GROUP BY r.Recipe_ID
      `;

    const results = await queryAsync(query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching recipes with ingredients:", error);
    res
      .status(500)
      .json({ message: "Error fetching recipes with ingredients" });
  }
});

function queryAsync(query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

//Checking route accessed
router.get("/", (req, res) => {
  console.log("Recipes route accessed");
  res.json({ message: "recipes.js is working" });
  res.send(req.body.test);
});

//Export the router
module.exports = router;
