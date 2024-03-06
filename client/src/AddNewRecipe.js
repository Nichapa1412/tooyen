import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IconButton, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CountrySelect from "./CountrySelect";

import "./css/AddNewRecipe.css";

export default function AddNewRecipe() {
  const classes = useState();

  const [isAddedNewItemOpen, setIsAddedNewItemOpen] = useState(false);

  const handleOpenAddedNewItem = () => {
    handleClosePopup();
    setIsAddedNewItemOpen(true);
  };

  const handleCloseAddedNewItem = () => {
    setIsAddedNewItemOpen(false);
  };

  const handleClosePopup = () => {};

  const [activeIngredients, setActiveIngredients] = useState([]);

  const [recipeData, setRecipeData] = useState({
    Recipe_Name: "",
    Country: "Non-Specify",
    Difficulty: "Beginner",
    Ingredients_List: [{ Item_Name: "", Quantity: "" }],
    activeIngredientIndex: null,
    ingredientSuggestions: [],
  });

  useEffect(() => {
    fetchAllIngredients().then((suggestions) => {
      setRecipeData((prevData) => ({
        ...prevData,
        ingredientSuggestions: suggestions,
      }));
    });
  }, [recipeData]);

  const fetchAllIngredients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/recipes/fetchAllIngredients"
      );
      return response.data.map((ingredient) => ({
        value: ingredient.Item_Name,
        label: ingredient.Item_Name,
      }));
    } catch (error) {
      console.error("Error fetching all ingredients:", error);
      return [];
    }
  };

  const fetchIngredientSuggestions = async (query) => {
    try {
      const response = await axios.get(`/api/ingredients?query=${query}`);
      return response.data.map((suggestion) => ({
        value: suggestion.Item_Name,
        label: suggestion.Item_Name,
      }));
    } catch (error) {
      console.error("Error fetching ingredient suggestions:", error);
      return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value);
    setRecipeData({ ...recipeData, [name]: value });
  };

  const handleSelectChange = (selectedOption, index) => {
    console.log("Selected Ingredient:", selectedOption);
    const updatedIngredients = [...recipeData.Ingredients_List];
    updatedIngredients[index].Item_Name = selectedOption
      ? selectedOption.label || ""
      : "";

    setRecipeData({
      ...recipeData,
      Ingredients_List: updatedIngredients,
    });

    setActiveIngredients((prev) => [
      ...prev.slice(0, index),
      selectedOption || null,
      ...prev.slice(index + 1),
    ]);
  };

  const loadOptions = (inputValue) => {
    if (inputValue.trim() === "") {
      return fetchAllIngredients();
    } else {
      return fetchIngredientSuggestions(inputValue);
    }
  };

  const addIngredient = () => {
    setRecipeData((prevData) => ({
      ...prevData,
      Ingredients_List: [
        ...prevData.Ingredients_List,
        { Item_Name: "", Quantity: "" },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipeData.Recipe_Name || !hasNonEmptyIngredients()) {
      console.error("Please fill in all required fields.");
      return;
    }

    console.log("Submit button clicked");

    try {
      const response = await axios.post(
        "http://localhost:5000/recipes/addRecipe",
        recipeData
      );
      console.log("Data submitted successfully:", response.data);
      console.log("Submitted data:", recipeData);

      setRecipeData({
        Recipe_Name: "",
        Country: "Non-Specify",
        Difficulty: "Beginner",
        Ingredients_List: [{ Item_Name: "", Quantity: "" }],
        ingredientSuggestions: [],
      });
      setActiveIngredients([]);

      handleOpenAddedNewItem();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const hasNonEmptyIngredients = () => {
    return recipeData.Ingredients_List.every(
      (ingredient) =>
        ingredient.Item_Name.trim() !== "" && ingredient.Quantity.trim() !== ""
    );
  };

  const handleIngredientFocus = async (index) => {
    const suggestions = await loadOptions("");

    setRecipeData({
      ...recipeData,
      activeIngredientIndex: index,
      ingredientSuggestions: suggestions,
    });

    setActiveIngredients((prev) => [
      ...prev.slice(0, index),
      null,
      ...prev.slice(index + 1),
    ]);
  };

  const handleCountryChange = (selectedCountry) => {
    console.log("Selected Country:", selectedCountry);
    if (selectedCountry && selectedCountry.label) {
      setRecipeData({
        ...recipeData,
        Country: selectedCountry.label,
      });
    }
  };

  const handleIngredientQuantityChange = (e, index) => {
    const { value } = e.target;
    console.log(`Quantity changed for index ${index}:`, value);

    const updatedIngredients = [...recipeData.Ingredients_List];
    updatedIngredients[index].Quantity = value;

    setRecipeData({
      ...recipeData,
      Ingredients_List: updatedIngredients,
    });
  };

  const filterOptions = createFilterOptions({
    matchFrom: "start",
  });

  return (
    <div className="centered-container-an">
      <Link to="/Recipe" className="back-button-an">
        <IconButton>
          <ArrowBackIosIcon
            sx={{ color: "black", width: "50px", height: "50px" }}
          />
        </IconButton>
      </Link>
      <div className="square-navigation-bar-an"></div>
      <div className="Header-an">Add New Recipe</div>
      <div className="square-background-an">
        <div className="formcontainer-an">
          <div className="scrollable-container-AddNew">
            <form id="recipeForm" className={classes.root}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  spacing={0}
                  style={{
                    gridGap: "30px",
                    marginBottom: "40px",
                    marginTop: "30px",
                    marginLeft: "50px",
                  }}
                >
                  <div className="ingredient-text-an">
                    <h1>Recipe's Name</h1>
                  </div>
                  <div className="box-an">
                    <TextField
                      required
                      className="new-name-text-add"
                      variant="standard"
                      label="Recipe's name"
                      name="Recipe_Name"
                      value={recipeData.Recipe_Name}
                      onChange={handleInputChange}
                      sx={{
                        m: 1,
                        minWidth: 300,
                        backgroundColor: "#FAE495",
                        borderRadius: 20,
                      }}
                      style={{
                        width: "25rem",
                        textDecoration: "none",
                      }}
                    />
                  </div>
                  <div className="ingredient-text-an">
                    <h1>Country</h1>
                  </div>
                  <div className="box-an">
                    <CountrySelect onSelectCountry={handleCountryChange} />
                  </div>
                  <div className="ingredient-text-an">
                    <h1>Difficulty</h1>
                  </div>
                  <div className="box-an">
                    <TextField
                      select
                      required
                      className="new-name-text-add"
                      variant="standard"
                      label="Difficulty"
                      name="Difficulty"
                      value={recipeData.Difficulty}
                      onChange={handleInputChange}
                      sx={{
                        m: 1,
                        minWidth: 300,
                        backgroundColor: "#FAE495",
                        borderRadius: 20,
                      }}
                      style={{
                        width: "25rem",
                        textDecoration: "none",
                      }}
                    >
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </TextField>
                  </div>
                  <div className="ingredient-text-an">
                    <Stack spacing={2} direction="row">
                      <h1>Ingredients</h1>
                      <div>
                        <Button
                          className="plusicon-an"
                          variant="contained"
                          onClick={addIngredient}
                          style={{ backgroundColor: "#fab295" }}
                        >
                          + Add Ingredient
                        </Button>
                      </div>
                    </Stack>
                  </div>
                  {recipeData.Ingredients_List.map((ingredient, index) => (
                    <div key={index} className="ingredient-container">
                      <div className="box-an">
                        <Autocomplete
                          sx={{
                            m: 1,
                            minWidth: 300,
                            backgroundColor: "#FAE495",
                            borderRadius: 20,
                          }}
                          style={{
                            width: "25rem",
                            textDecoration: "none",
                          }}
                          filterOptions={filterOptions}
                          isOptionEqualToValue={(option, value) =>
                            option.label === value.label
                          }
                          options={recipeData.ingredientSuggestions}
                          getOptionLabel={(option) => option.label || ""}
                          value={activeIngredients[index] || null}
                          onChange={(_, selectedOption) =>
                            handleSelectChange(selectedOption, index)
                          }
                          onFocus={() => handleIngredientFocus(index)}
                          renderInput={(params) => (
                            <TextField
                              required
                              variant="standard"
                              {...params}
                              label="Ingredient Name"
                              placeholder="Select your ingredient"
                            />
                          )}
                        />
                      </div>
                      <br />
                      <div className="box-an">
                        <TextField
                          sx={{
                            m: 1,
                            minWidth: 300,
                            backgroundColor: "#FAE495",
                            borderRadius: 20,
                          }}
                          style={{
                            width: "25rem",
                            textDecoration: "none",
                          }}
                          required
                          variant="standard"
                          type="number"
                          label="Ingredient Quantity"
                          placeholder="Enter ingredient quantity"
                          name={`Quantity${index}`}
                          value={recipeData.Ingredients_List[index].Quantity}
                          onChange={(e) =>
                            handleIngredientQuantityChange(e, index)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </Grid>
              </Box>
            </form>
          </div>
        </div>

        <div className="btngroup-an">
          <Link to="/Recipe">
            <Button
              className="cancel-button-an"
              variant="contained"
              color="error"
            >
              Cancel
            </Button>
          </Link>

          <Button
            className="confirm-button-an"
            variant="contained"
            style={{ backgroundColor: "#24bd2a" }}
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </div>

        <Modal
          open={isAddedNewItemOpen}
          onClose={handleCloseAddedNewItem}
          aria-labelledby="add-new-item-popup-title"
          aria-describedby="add-new-item-popup-description"
        >
          <div className="complete-added-popup-content-an">
            <CheckCircleOutlineIcon
              className="sucessfully-added-icon-an"
              sx={{
                fontSize: "25px",
                width: "100px",
                height: "100px",
                color: "white",
              }}
            />
            <h2 className="complete-added-popup-title-an">
              New recipe was added.
            </h2>
            <Link to="/Recipe">
              <Button
                className="done-added-button-an"
                variant="contained"
                color="info"
                onClick={handleCloseAddedNewItem}
                sx={{
                  fontSize: "20px",
                  color: "black",
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#c1c1c1" },
                }}
              >
                DONE
              </Button>
            </Link>
          </div>
        </Modal>
      </div>
    </div>
  );
}
