import React from "react";
import { Navbar } from "./navbar";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import ShoppingList from "./ShoppingList";
import Settings from "./Settings";
import SearchItem from "./SearchItem";
import NotificationCenter from "./NotificationCenter";
import CartHistory from "./CartHistory";
import AddToList from "./AddToList";
import AddToFridge from "./AddToFridge";
import RecipeBook from "./RecipeBook";
import AddNewRecipe from "./AddNewRecipe";
import RecipeDetailPage from "./RecipeDetailPage";
import ResetRecipes from "./ResetRecipes";

export default function App1() {
  const navbarStyle = {
    position: "fixed",
    top: "1290px",
    left: "80px",
  };

  return (
    <div
      style={{ border: "1px solid Black", width: "960px", height: "1440px" }}
    >
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/ShoppingList" element={<ShoppingList />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/SearchItem" element={<SearchItem />} />
          <Route path="/NotificationCenter" element={<NotificationCenter />} />
          <Route path="/CartHistory" element={<CartHistory />} />
          <Route path="/AddToList" element={<AddToList />} />
          <Route path="/AddToFridge" element={<AddToFridge />} />
          <Route path="/Recipe" element={<RecipeBook />} />
          <Route path="/resetRecipes" element={<ResetRecipes />} />
          <Route path="/AddNewRecipe" element={<AddNewRecipe />} />
          <Route path="/Recipe/:recipeId" element={<RecipeDetailPage />} />
        </Routes>
      </div>
      <div style={navbarStyle}>
        <Navbar />
      </div>
    </div>
  );
}
