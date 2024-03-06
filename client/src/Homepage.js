// Description: This is the homepage where there are multiple code displaying in this part including Storage.js, UpcomingExpire.js,
// Fridge.js, ReadyToServe.js

import React, { useEffect, useState } from "react";
import "./css/Homepage.css";
import Storage from "./Storage";
import UpCommingExpire from "./UpCommingExpire";
import Fridge from "./Fridge";
import ReadyToServe from "./ReadyToServe";
import Bell from "@mui/icons-material/Notifications";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

// For time configure
function getDate() {
  const today = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const MonthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = MonthsOfYear[today.getMonth()];
  const date = today.getDate();
  const day = daysOfWeek[today.getDay()];
  return `${day}, ${date} ${month}`;
}

// Add Zero for time if number is less than 0 (from 7:10 to be 07:10)
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export default function Homepage() {
  const [currentTime, setCurrentTime] = useState(getTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getTime());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function getTime() {
    const today = new Date();
    const hours = addZero(today.getHours());
    const minutes = addZero(today.getMinutes());
    return `${hours}:${minutes}`;
  }

  function getWelcomeText() {
    const today = new Date();
    const hour = today.getHours();
    if (hour >= 0 && hour <= 4) {
      return <h1 className="WelcomeText">Good Night</h1>;
    } else if (hour >= 5 && hour <= 9) {
      return <h1 className="WelcomeText">Good Morning</h1>;
    } else if (hour >= 10 && hour <= 15) {
      return <h1 className="WelcomeText">Good Afternoon</h1>;
    } else if (hour >= 16 && hour <= 20) {
      return <h1 className="WelcomeText">Good Evening</h1>;
    } else {
      return <h1 className="WelcomeText">Good Night</h1>;
    }
  }
  return (
    <div className="Homepage">
      {getWelcomeText()}
      <h1 className="CurrentDate"> {getDate()}</h1>
      <h1 className="CurrentTime"> {currentTime}</h1>
      <div className="BellIcon">
        <Link to="/NotificationCenter">
          <IconButton>
            <Bell
              style={{
                maxWidth: "65px",
                maxHeight: "65px",
                minWidth: "65px",
                minHeight: "65px",
                color: "Black",
              }}
            />
          </IconButton>
        </Link>
      </div>
      <UpCommingExpire />
      <ReadyToServe />
      <Fridge />
      <Storage />
    </div>
  );
}
