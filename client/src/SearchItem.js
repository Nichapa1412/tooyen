// Description: This is SearchItem. This part will display about the items in the fridge also able categorized by its category.
// This code will have 2 mode of displaying, fridge mode and list mode. If you type in searchbar and the item doesn't exist.
// This means that this items doesn't exist in the database. So user need to click plus button on the top right first to link to
// add item to the database. Once the database know this item, user is now able to type in searchbar and add item to the fridge by provide
// quantity, location, duration of keeping.
import React, { useState, useEffect } from "react";
import "./css/SearchItem.css";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import PlusIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import KitchenIcon from "@mui/icons-material/Kitchen";
import ListIcon from "@mui/icons-material/List";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  // Create the "day month year" format
  return `${day} ${month} ${year}`;
};

const formatDate2 = (timeDifference) => {
  if (timeDifference < 0) {
    return "Item Expired";
  }

  const milliseconds = timeDifference;

  const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));

  if (days === 1) {
    return `${days} day left`;
  } else if (days === 0 && hours === 1) {
    return `${hours} hour left`;
  } else if (days === 0 && hours === 0 && minutes === 1) {
    return `${minutes} minute left`;
  } else if (days === 0 && (hours > 1 || (hours === 1 && minutes > 0))) {
    return `${hours} hours left`;
  } else if (days === 0 && minutes > 1) {
    return `${minutes} minutes left`;
  } else {
    return `${days} days left`;
  }
};

export default function SearchItem() {
  const [selectedCategory, setSelectedCategory] = useState("Fruit");
  const [selectedCategoryIsActive, setSelectedCategoryIsActive] =
    useState(true); // Initially set Fruit as active
  const [SelectedDisplayMode, SetSelectedDisplayMode] = useState("Fridge");
  const [SelectedDisplayModeIsActive, SetSelectedDisplayModeIsActive] =
    useState(true); // Initially set Fridge Mode as active
  const [items, setItems] = useState([]);
  const [specificItemName, setSpecificItemName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/home/itemInFridgeAll?Category=${selectedCategory}`
        );
        if (!response.ok) {
          throw new Error("Error fetching items");
        }

        const data = await response.json();
        setItems(data.items);
      } catch (error) {
        setItems([]);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCategoryClicked = async (category) => {
    setItems([]);

    try {
      const response = await fetch(
        `http://localhost:5000/home/itemInFridgeAll?Category=${category}`
      );
      if (!response.ok) {
        throw new Error("Error fetching items");
      }

      const data = await response.json();
      setItems(data.items);
      setSelectedCategory(category);
      setSelectedCategoryIsActive(true);
    } catch (error) {
      setSelectedCategory(category);
      setItems([]);
    }
  };

  const handleInputChange = (event) => {
    setSpecificItemName(event.target.value);
  };

  const handleModeClicked = (Mode) => {
    SetSelectedDisplayMode(Mode);
    SetSelectedDisplayModeIsActive(true);
  };

  return (
    <div className="InvBG">
      <h1 className="InventoryText">Inventory</h1>
      <img
        src="../Fridge_Asset/inventory.png"
        style={{
          width: "120px",
          height: "110px",
          marginLeft: "400px",
          marginTop: "60px",
        }}
      />
      <Link to="/AddToFridge">
        <div className="InvAddBtn">
          <IconButton>
            <PlusIcon
              style={{
                width: "90px",
                height: "90px",
                color: "black",
              }}
            />
          </IconButton>
        </div>
      </Link>
      <div className="InvWhiteBG">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "40px",
            marginLeft: "70px",
          }}>
          <div className="SearchBarWrapper">
            <SearchIcon
              className="SearchIcon"
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
              className="SearchInput-sl"
              value={specificItemName}
              onChange={handleInputChange}
            />
          </div>

          <div className="DisplayMode">
            <div
              className={`FridgeMode ${
                SelectedDisplayModeIsActive && SelectedDisplayMode === "Fridge"
                  ? "active"
                  : ""
              }`}
              onClick={() => handleModeClicked("Fridge")}>
              <KitchenIcon
                className="KitchenIconWrapper"
                style={{
                  maxWidth: "60px",
                  maxHeight: "60px",
                  minWidth: "60px",
                  minHeight: "60px",
                  color: "Black",
                  marginLeft: "17.5px",
                  marginTop: "11.5px",
                  cursor: "pointer",
                }}
              />
            </div>
            <div
              alt="Line Separate Each Mode"
              style={{
                width: "3px",
                height: "69px",
                backgroundColor: "black",
                marginLeft: "2px",
                marginTop: "8px",
              }}
            />
            <div
              className={`ListMode ${
                SelectedDisplayModeIsActive && SelectedDisplayMode === "List"
                  ? "active"
                  : ""
              }`}
              onClick={() => handleModeClicked("List")}>
              <ListIcon
                className="ListIconWrapper"
                style={{
                  maxWidth: "80px",
                  maxHeight: "80px",
                  minWidth: "80px",
                  minHeight: "80px",
                  color: "Black",
                  marginTop: "2px",
                  marginLeft: "7.5px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>
        <div className="AllCategoryButton1">
          <Stack spacing={2.6} direction="row">
            <button
              className={`CategoryButton1 ${
                selectedCategoryIsActive && selectedCategory === "Fruit"
                  ? "active"
                  : ""
              }`}
              onClick={() => handleCategoryClicked("Fruit")}>
              Fruit
            </button>
            <button
              className={`CategoryButton1 ${
                selectedCategoryIsActive && selectedCategory === "Vegetable"
                  ? "active"
                  : ""
              }`}
              onClick={() => handleCategoryClicked("Vegetable")}>
              Vegetable
            </button>
            <button
              className={`CategoryButton1 ${
                selectedCategoryIsActive && selectedCategory === "Protein"
                  ? "active"
                  : ""
              }`}
              onClick={() => handleCategoryClicked("Protein")}>
              Protein
            </button>
            <button
              className={`CategoryButton1 ${
                selectedCategoryIsActive && selectedCategory === "Dairy"
                  ? "active"
                  : ""
              }`}
              onClick={() => handleCategoryClicked("Dairy")}>
              Dairy
            </button>
            <button
              className={`CategoryButton1 ${
                selectedCategoryIsActive && selectedCategory === "Drinks"
                  ? "active"
                  : ""
              }`}
              onClick={() => handleCategoryClicked("Drinks")}>
              Drinks
            </button>
            <button
              className={`CategoryButton1 ${
                selectedCategoryIsActive && selectedCategory === "Grains"
                  ? "active"
                  : ""
              }`}
              onClick={() => handleCategoryClicked("Grains")}>
              Grains
            </button>
          </Stack>
        </div>

        {SelectedDisplayMode === "Fridge" && (
          <div>
            <div alt="FridgeBody">
              <img
                className="InvFridgeBody"
                src="../Fridge_Asset/FridgeBodyNoDoor.png"
              />
              <img
                className="InvFridgeDoorL"
                src="../Fridge_Asset/FridgeDoor.png"
              />
              <img
                className="InvFridgeDoorR"
                src="../Fridge_Asset/FridgeDoor.png"
              />
            </div>

            <div>
              <div className="InvContainerFridge">
                {[...Array(10)].map((_, index) => {
                  const itemsAtLocation = items.filter(
                    (item) => item.Loc_Num === index + 1
                  );
                  const renderedItems = itemsAtLocation.slice(0, 4); // Limit to a maximum of 4 items
                  return (
                    <div
                      key={index}
                      className={`InvContainer${index % 2 === 0 ? "1" : "2"}`}>
                      <div className="WrapperContainerNo">
                        <h2 className="ContainerNoText">{index + 1}</h2>
                      </div>
                      <div
                        alt="InvDetail Small"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "10px",
                          height: "130px",
                        }}>
                        {renderedItems.map((item, i) => (
                          <div
                            key={i}
                            className="InvFName"
                            id={
                              item.Item_Name.toLowerCase().startsWith(
                                specificItemName.toLowerCase()
                              ) || specificItemName === ""
                                ? "show"
                                : "hide"
                            }>
                            {`• ${item.Item_Name}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {SelectedDisplayMode === "List" && (
          <div className="Card" style={{ height: "800px", overflow: "scroll" }}>
            {console.log("Rendering items:", items)}
            {items.length > 0 ? (
              items
                .slice() // Create a shallow copy of the array to avoid mutating the original array
                .sort((a, b) => {
                  const difference = new Date(a.Ex_Date) - new Date(b.Ex_Date);
                  if (difference <= 0) {
                    // If the difference is less than or equal to 0, move the item with a smaller expiration date to the front
                    return -1;
                  } else {
                    return 1;
                  }
                })
                .sort((a, b) => {
                  // Additional sorting to prioritize unexpired items
                  const isAExpired = new Date(a.Ex_Date) <= new Date();
                  const isBExpired = new Date(b.Ex_Date) <= new Date();
                  if (isAExpired && !isBExpired) {
                    return 1; // Move expired items to the end
                  } else if (!isAExpired && isBExpired) {
                    return -1; // Move unexpired items to the front
                  } else {
                    return 0; // Preserve the order of items with the same expiration status
                  }
                })
                .map((item) => (
                  <div
                    key={item.Item_ID}
                    className="InvBox"
                    id={
                      item.Item_Name.toLowerCase().startsWith(
                        specificItemName.toLowerCase()
                      ) || specificItemName === ""
                        ? "show"
                        : "hide"
                    }>
                    {new Date(item.Ex_Date) > new Date() ? (
                      <div className="InvStatusLineActive" />
                    ) : (
                      <div className="InvStatusLine" />
                    )}
                    <img
                      className="InvImage"
                      src={`../img/${item.Item_Name.replace(
                        /\s/g,
                        "_"
                      ).toLowerCase()}.png`}
                      alt={item.Item_Name}
                      style={{
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.src = "../img/default.png";
                      }}
                    />
                    <div className="InvDetailWrapper">
                      <h3 className="InvName">{item.Item_Name}</h3>
                      <div className="InvDetail">
                        Purchase Date: {formatDate(item.Add_Date)}
                      </div>
                      <div className="InvDetail">
                        Expire Date: {formatDate(item.Ex_Date)}
                      </div>
                      <div className="InvDetail">Location: {item.Loc_Num}</div>
                    </div>
                    {formatDate2(new Date(item.Ex_Date) - new Date()) ===
                    "Item Expired" ? (
                      <h2 className="InvTimeExp">Item Expired</h2>
                    ) : (
                      <h2 className="InvTime">
                        {formatDate2(new Date(item.Ex_Date) - new Date())}
                      </h2>
                    )}
                  </div>
                ))
            ) : (
              <div className="NoItemCategory"></div>
            )}

            {items.length === 0 && (
              <div className="NoItemCategory">
                There is no item in this category
              </div>
            )}

            {items.length > 0 &&
              !items.some((item) =>
                item.Item_Name.toLowerCase().startsWith(
                  specificItemName.toLowerCase()
                )
              ) && (
                <div className="NoItemCategory">
                  No item found in this category
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
