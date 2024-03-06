// Description: This code is for ReadyToServe. It is about displaying random menu query in database everytime the homepage is refreshed.
// By clicked this ReadyToServer, it will link to each menu detail page.
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/ReadyToServe.css";

export default function Test() {
  const [randomRecipe, setRandomRecipe] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/recipes/fetchAllRecipesWithIngredients"
        );
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const selectedRecipe = response.data[randomIndex];
        setRandomRecipe(selectedRecipe);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="ReadyToServe">
      <Link
        className="TestLink"
        to={`/Recipe/${randomRecipe.Recipe_ID}`}
        key={randomRecipe.Recipe_ID}>
        <div className="ReadyToServeText">Ready To Serve</div>
        {randomRecipe && (
          <div className="MenuWhiteBox">
            <img
              src={`../recipeimg/${randomRecipe.Image}`}
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                marginTop: "10px",
              }}
              alt={randomRecipe.Recipe_Name}
            />
            <div className="MenuDetail">
              <div className="MenuName">{randomRecipe.Recipe_Name}</div>
              <div className="MenuDescription">
                {`Country: ${randomRecipe.Country}`}
                <br />
                {`Difficulty: ${randomRecipe.Difficulty}`}
                <br />
                {`Ingredients: ${randomRecipe.Ingredients.split(",")
                  .slice(0, 5)
                  .join(", ")}`}
              </div>
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}
