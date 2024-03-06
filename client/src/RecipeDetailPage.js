import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import {
  IconButton,
  Paper,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Lottie from "lottie-react";
import cookingAnimationData from "./cooking.json";
import "./css/RecipeDetailPage.css";

export default function RecipeDetailPage() {
  const { recipeId } = useParams();
  const [recipeCount, setRecipeCount] = useState(1);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [isAddedNewItemOpen, setAddedNewItemOpen] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/recipes/fetchRecipeDetails/${recipeId}`
        );
        setRecipeDetails(response.data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  useEffect(() => {
    if (recipeDetails) {
      const servingAvail = Math.floor(
        Math.min(
          ...recipeDetails.Ingredients.map(
            (ingredient) => ingredient.servingAvail
          )
        )
      );
      setRecipeCount(servingAvail === 0 ? 0 : 1);
    }
  }, [recipeDetails]);

  if (!recipeDetails) {
    return <div>Loading...</div>;
  }

  const RecipeIncrementCount = () => {
    if (recipeCount < servingAvail) {
      setRecipeCount(recipeCount + 1);
    }
  };

  const RecipeDecrementCount = () => {
    setRecipeCount(Math.max(recipeCount - 1, 0));
  };

  const handleConfirmButtonClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/recipes/updateIngredientQuantities",
        {
          recipeId: recipeDetails.Recipe_ID,
          servingsCooked: recipeCount,
        }
      );

      console.log("Ingredient quantities updated successfully:", response.data);

      setAddedNewItemOpen(true);
    } catch (error) {
      console.error("Error updating ingredient quantities:", error);
    }
  };

  const handleCloseAddedNewItem = () => {
    setAddedNewItemOpen(false);
  };

  const servingAvail = recipeDetails.Ingredients
    ? Math.floor(
        Math.min(
          ...recipeDetails.Ingredients.map(
            (ingredient) => ingredient.servingAvail
          )
        )
      )
    : 0;
  return (
    <div className="centered-container-an">
      <Link to="/Recipe" className="back-button-an">
        <IconButton>
          <ArrowBackIosIcon
            sx={{ color: "black", width: "50px", height: "50px" }}
          />
        </IconButton>
      </Link>
      <div className="Header-an">Suggested Recipe</div>
      <img className="Recipe-icon-rb" src="../recipe.png" />
      <div className="square-background-an1">
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
          />
        </div>
        <div className="RecipeWhitebox">
          <h2 className="RecipeMenuName">{recipeDetails.Recipe_Name}</h2>
          <div
            className={`Recipe${servingAvail === 0 ? "Lack" : "Ready"}ToCook`}>
            <h2 className="ReadyToCookText">
              {" "}
              {servingAvail === 0 ? "Lack Ingredients" : "Ready to Cook"}
            </h2>
          </div>

          <div className="RecipeMenuPicture">
            <img
              className="image-recipe-detail"
              src={`/recipeImg/${recipeDetails.Image}`}
              alt={`Recipe: ${recipeDetails.Recipe_Name}`}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "300px",
            }}>
            <div className="RecipeStepText">
              Country: {recipeDetails.Country}
            </div>
            <div className="RecipeStepText">
              Difficulty: {recipeDetails.Difficulty}
            </div>
          </div>

          <h2 className="RecipeIngredientInFridgeText">Ingredients:</h2>
          <TableContainer
            component={Paper}
            style={{
              margin: "16px",
              width: "400px",
              position: "absolute",
              top: "320px",
              left: "430px",
              maxHeight: "280px",
            }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ padding: "8px" }}>Ingredient</TableCell>
                  <TableCell style={{ padding: "8px" }}>Quantity</TableCell>
                  <TableCell style={{ padding: "8px" }}>
                    Quantity Available
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipeDetails.Ingredients &&
                  recipeDetails.Ingredients.map((ingredient, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ padding: "8px" }}>
                        {ingredient.Item_Name}
                      </TableCell>
                      <TableCell style={{ padding: "8px" }}>
                        {ingredient.Quantity}
                      </TableCell>
                      <TableCell style={{ padding: "8px" }}>
                        {ingredient.quantityAvail}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <h2 className="RecipeServing">
            {recipeDetails.Ingredients &&
              Math.floor(
                Math.min(
                  ...recipeDetails.Ingredients.map(
                    (ingredient) => ingredient.servingAvail
                  )
                )
              )}{" "}
            Servings Available
          </h2>
          <div className="RecipeGroupBtnAndTemp">
            <div className="RecipeButton" onClick={RecipeDecrementCount}>
              <h1 className="RecipeButtonText">-</h1>
            </div>
            <h2 className="RecipeNoServingText">{recipeCount}</h2>
            <div className="RecipeButton" onClick={RecipeIncrementCount}>
              <h1 className="RecipeButtonText">+</h1>
            </div>
          </div>

          <div
            className={`ConfirmBtn-rs ${recipeCount === 0 ? "disable" : ""}`}
            onClick={() => {
              if (recipeCount !== 0) {
                handleConfirmButtonClick();
              }
            }}>
            <h2 className={"ConfirmText-rs"}>Cook!</h2>
          </div>
          <Modal
            open={isAddedNewItemOpen}
            onClose={handleCloseAddedNewItem}
            aria-labelledby="add-new-item-popup-title"
            aria-describedby="add-new-item-popup-description">
            <div className="complete-added-popup-content-rs">
              <div
                className="cooking-rs"
                style={{ width: "90%", height: "90%" }}>
                <Lottie
                  animationData={cookingAnimationData}
                  options={{
                    loop: true,
                    autoplay: true,
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
                <h2 className="complete-added-popup-title-rs">
                  {recipeDetails.Recipe_Name} is cooking!
                  <br /> The ingredients were removed!{" "}
                </h2>
              </div>
              <Link style={{ textDecoration: "none" }} to="/Recipe">
                <div
                  className="RecipeDoneBtn"
                  onClick={handleCloseAddedNewItem}>
                  <h2 className="RecipeDoneText">Done</h2>
                </div>
              </Link>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
