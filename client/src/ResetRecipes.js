import React, { useState } from "react";
import axios from "axios";

const ResetRecipes = () => {
  const [resetStatus, setResetStatus] = useState(null);

  const handleResetClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/recipes/resetRecipes"
      );
      setResetStatus(response.data.message);
    } catch (error) {
      console.error("Error resetting recipes:", error);
      setResetStatus("Error resetting recipes.");
    }
  };

  return (
    <div>
      <h1>Reset Recipes</h1>
      <button onClick={handleResetClick}>Reset Recipes</button>
      {resetStatus && <p>{resetStatus}</p>}
    </div>
  );
};

export default ResetRecipes;
