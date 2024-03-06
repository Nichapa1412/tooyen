import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import { createSvgIcon } from "@mui/material/utils";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import "./css/RecipeBook.css";
import AddIcon from "@mui/icons-material/Add";

const useRecipeFetch = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/recipes/fetchAllRecipesWithIngredients"
        );
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Error fetching recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
};

const RecipeBook = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { recipes, loading, error } = useRecipeFetch();

  if (loading) {
    return <p></p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const startWithSearchTerm = recipes.filter((recipe) =>
    recipe.Recipe_Name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const containSearchTerm = recipes.filter(
    (recipe) =>
      !recipe.Recipe_Name.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
      recipe.Recipe_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecipes = startWithSearchTerm.concat(containSearchTerm);

  return (
    <div className="recipe">
      <div className="centered-container">
        <div className="square-navigation-bar-r"></div>
        <div className="Header-r">Recipe Book</div>
        <img className="RecipeBook1" src="../book1.png"></img>

        <Link to="/AddNewRecipe">
          <IconButton className="PlusIcon-r">
            <AddIcon
              style={{
                maxWidth: "90px",
                maxHeight: "90px",
                minWidth: "90px",
                minHeight: "90px",
                color: "Black",
              }}
            />
          </IconButton>
        </Link>

        <div className="square-background-r">
          <div className="RecipeSearchBarContainer">
            <SearchIcon
              className="RecipeSearchIcon"
              style={{
                maxWidth: "50px",
                maxHeight: "50px",
                minWidth: "50px",
                minHeight: "50px",
                color: "Black",
              }}
            />
            <input
              placeholder="Search Items"
              color="00000"
              className="SearchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            className="scrollable-container-r"
            style={{ marginLeft: "15px" }}>
            <Box sx={{ flexGrow: 1, marginTop: 10 }}>
              <Grid
                container
                spacing={4}
                style={{ gridGap: "30px", marginBottom: "40px" }}>
                {filteredRecipes.map((recipe, index) => (
                  <Link
                    to={`/Recipe/${recipe.Recipe_ID}`}
                    key={recipe.Recipe_ID}>
                    <div className="square-list-rb">
                      <h1 className="item-text-found-rb">
                        {recipe.Recipe_Name}
                      </h1>
                      <img
                        className="image-recipe-book"
                        src={`/recipeImg/${recipe.Image}`}
                        alt={`Recipe: ${recipe.Recipe_Name}`}
                      />
                    </div>
                  </Link>
                ))}
              </Grid>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeBook;
