// Description: This is fridge setting part in homepage. It is about temperature controlling and it able to change the unit of temperature
// like Celcius and Farenheit.

import React, { useState, useEffect } from "react";
import "./css/Fridge.css";
import Stack from "@mui/material/Stack";

export default function Fridge() {
  const [Count, SetCount] = useState(0);
  const [SelectedUnit, SetSelectedUnit] = useState("°C");
  const [IsActive, SetIsActive] = useState(true);

  const ChangeUnit = (Unit) => {
    const numericCount = typeof Count === "number" ? Count : 0;

    if (Unit === "°C") return numericCount;
    return (numericCount * 9) / 5 + 32;
  };

  useEffect(() => {
    fetch("http://localhost:5000/fconf/fetchTemp")
      .then((response) => response.json())
      .then((data) => {
        const initialTemperature = data.temperatureData[0];
        SetCount(initialTemperature);
      })
      .catch((error) => {
        console.error("Error fetching temperature:", error);
      });
  }, []);

  const updateTemperature = (newTemperature) => {
    fetch("http://localhost:5000/fconf/updateProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Temp: String(newTemperature),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error updating temperature:", error);
      });
  };

  const IncrementCount = () => {
    const newTemperature = Count + 1;
    if (newTemperature <= 10) {
      SetCount(newTemperature);
      updateTemperature(newTemperature);
    }
  };

  const DecrementCount = () => {
    const newTemperature = Count - 1;
    if (newTemperature >= -5) {
      SetCount(newTemperature);
      updateTemperature(newTemperature);
    }
  };

  const HandleCategoryClicked = (Unit) => {
    SetSelectedUnit(Unit);
    SetIsActive(true);
  };

  return (
    <div className="Fridge">
      <div className="FridgeText">Fridge</div>
      <div className="UnitChanger">
        <Stack direction="row" spacing={5}>
          <div
            className={`SelectedCircle ${
              IsActive && SelectedUnit === "°C" ? "active" : ""
            }`}
            onClick={() => HandleCategoryClicked("°C")}>
            <h1 className="ButtonText1">°C</h1>
          </div>
          <div
            className={`SelectedCircle ${
              IsActive && SelectedUnit === "°F" ? "active" : ""
            }`}
            onClick={() => HandleCategoryClicked("°F")}>
            <h1 className="ButtonText1">°F</h1>
          </div>
        </Stack>
      </div>
      <div className="WhiteBox">
        <div className="GroupBtnAndTemp">
          <div className="Button" onClick={DecrementCount}>
            <h1 className="ButtonText">-</h1>
          </div>
          <h2 className="TemperatureText">{ChangeUnit(SelectedUnit)}</h2>
          <div className="Button" onClick={IncrementCount}>
            <h1 className="ButtonText">+</h1>
          </div>
        </div>
        <div className="TemperatureText1">Temperature</div>
      </div>
    </div>
  );
}
