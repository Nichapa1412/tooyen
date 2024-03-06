// Description: This code will about UpComingExpire item. It will display about item that going to expire in 1 day, 2 day, 3 day, and 4day
// So the item will sorting in alphabetical order.

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/UpCommingExpire.css";
import Stack from "@mui/material/Stack";

export default function UpcomingExpire() {
  function GetDatePlusTwo() {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    const date = addZero(today.getDate());
    const month = addZero(today.getMonth() + 1);
    const year = today.getFullYear();
    return `${date}-${month}-${year}`;
  }

  function GetDatePlusThree() {
    const today = new Date();
    today.setDate(today.getDate() + 3); // Add three days
    const date = addZero(today.getDate());
    const month = addZero(today.getMonth() + 1);
    const year = today.getFullYear();
    return `${date}-${month}-${year}`;
  }

  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  const [expirationData, setExpirationData] = useState({
    today: [],
    tomorrow: [],
    nextTwo: [],
    nextThree: [],
  });

  useEffect(() => {
    axios.get("http://localhost:5000/home/itemExpire").then((response) => {
      setExpirationData(response.data);
    });

    const interval = setInterval(() => {
      axios.get("http://localhost:5000/home/itemExpire").then((response) => {
        setExpirationData(response.data);
      });
    }, 1000); // every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const getTagImage = (tag) => {
    const tagToImage = {
      Fruit: "fruit.png",
      Vegetable: "vegetable.png",
      Protein: "protein.png",
      Dairy: "dairy.png",
      Grains: "grains.png",
      Drinks: "drinks.png",
    };

    return tagToImage[tag] || "default.png";
  };

  return (
    <div className="UpComingExpire">
      <h1 className="UpComingExpirationDateText">Upcoming Expiration date</h1>
      <div className="AllUpComingExpireItem">
        <Stack spacing={2.6} direction="row">
          <div className="DateItemCard">
            <div className="Today">TODAY</div>
            {expirationData.today.slice(0, 3).map((item, index) => (
              <div
                className="IconAndItemName1"
                alt="CategoryIcon and ItemName1"
                key={index}>
                <div className="ItemName1">
                  <img
                    className="CategoryIcon"
                    src={`../Homepage_Asset/${getTagImage(item.Tag_Name)}`}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                  {item.Item_Name.split(" ").map((subItem, subIndex) => (
                    <div key={subIndex} className="ItemName1">
                      {subItem}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="DateItemCard">
            <div className="Tomorrow">TOMORROW</div>
            {expirationData.tomorrow.slice(0, 3).map((item, index) => (
              <div
                className="IconAndItemName1"
                alt="CategoryIcon and ItemName1"
                key={index}>
                <div className="ItemName1">
                  <img
                    className="CategoryIcon"
                    src={`../Homepage_Asset/${getTagImage(item.Tag_Name)}`}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                  {item.Item_Name.split(" ").map((subItem, subIndex) => (
                    <div key={subIndex} className="ItemName1">
                      {subItem}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="DateItemCard">
            <div className="Day">{GetDatePlusTwo()}</div>
            {expirationData.nextTwo.slice(0, 3).map((item, index) => (
              <div
                className="IconAndItemName1"
                alt="CategoryIcon and ItemName1"
                key={index}>
                <div className="ItemName1">
                  <img
                    className="CategoryIcon"
                    src={`../Homepage_Asset/${getTagImage(item.Tag_Name)}`}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                  {item.Item_Name.split(" ").map((subItem, subIndex) => (
                    <div key={subIndex} className="ItemName1">
                      {subItem}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="DateItemCard">
            <div className="Day">{GetDatePlusThree()}</div>
            {expirationData.nextThree.slice(0, 3).map((item, index) => (
              <div
                className="IconAndItemName1"
                alt="CategoryIcon and ItemName1"
                key={index}>
                <div className="ItemName1">
                  <img
                    className="CategoryIcon"
                    src={`../Homepage_Asset/${getTagImage(item.Tag_Name)}`}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                  {item.Item_Name.split(" ").map((subItem, subIndex) => (
                    <div key={subIndex} className="ItemName1">
                      {subItem}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Stack>
      </div>
    </div>
  );
}
