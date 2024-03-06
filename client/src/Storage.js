// Description: This is for one part of the homepage called "Storage". This function has 3 section of code.
// The first one is storage part display on homepage include category filter
// The second one is popup when clicked item on storage
// The third one is popup when confirm the takeout item
// The decoration css include 2 files Storage.css and ItemPopup.css. Storage.css will decorate in storage that display on homepage.
// But the Itempopup.css will decorate on the popup when item is clicked.
import React, { useState, useEffect } from "react";
import "./css/Storage.css";
import "./css/ItemPopup.css";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import History from "@mui/icons-material/Description";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const fetchItemsByCategory = async (category) => {
  try {
    const response = await fetch(
      `http://localhost:5000/home/itemInFridge?Category=${category}`
    );
    if (!response.ok) {
      throw new Error("Error fetching items");
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Create the "day month year" format
  return `${day} ${month} ${year}`;
};

export default function Storage() {
  const [selectedCategory, setSelectedCategory] = useState("Fruit");
  const [isActive, setIsActive] = useState(true); // Initially set Fruit as active
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedContainerNo, SetSelectedContainerNo] = useState("");
  const [openItemPopup, setOpenItemPopup] = useState(false);
  const [count, setCount] = useState(1);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const itemsData = await fetchItemsByCategory(selectedCategory);
      setItems(itemsData);
    };

    fetchData();
  }, [selectedCategory]);

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const incrementCount = () => {
    updateCount(count + 1);
  };

  const decrementCount = () => {
    updateCount(count - 1);
  };

  const updateCount = (newCount) => {
    const updatedCount = Math.min(Math.max(newCount, 1), selectedItem.Quantity);
    setCount(updatedCount);
  };

  const handleConfirmClick = async () => {
    try {
      setLoading(true);

      console.log(selectedItem.Inv_ID);

      const response = await fetch(
        `http://localhost:5000/home/changeItemInStock/${selectedItem.Inv_ID}/${count}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedItems = items
          .map((item) =>
            item.Inv_ID === selectedItem.Inv_ID
              ? { ...item, Quantity: selectedItem.Quantity - count }
              : item
          )
          .filter((item) => item.Quantity > 0);

        setItems(updatedItems);

        if (selectedItem.Quantity - count <= 0) {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.Inv_ID === selectedItem.Inv_ID
                ? { ...item, Quantity: 0 }
                : item
            )
          );
        }

        // Reset count to 1
        setCount(1);

        setOpenSuccessPopup(true);
        setOpenItemPopup(false);
        console.log("Quantity updated successfully");
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClicked = (item) => {
    setSelectedItem(item);
    setOpenItemPopup(true);
    SetSelectedContainerNo(item.Loc_Num);
  };

  const [buffer, setBuffer] = useState("Fruit"); //store category before category clicked

  const handleCategoryClicked = (category) => {
    if (buffer !== category) {
      setItems([]);
    }
    setBuffer(category);
    setSelectedCategory(category);
    setIsActive(true);
  };

  const handleCancelButton = () => {
    setCount(1);
    setOpenItemPopup(false);
  };

  return (
    <div className="HomepageSize">
      <div className="Storage">
        <h1 className="TextStorage">Storage</h1>

        <Link to="/SearchItem" style={{ textDecoration: "none" }}>
          <div className="HomepageBackBtn">
            <IconButton>
              <ArrowBack
                style={{
                  maxWidth: "30px",
                  maxHeight: "30px",
                  minWidth: "30px",
                  minHeight: "30px",
                  color: "Black",
                }}
              />
            </IconButton>
          </div>
        </Link>

        <div className="AllCategoryButton">
          <Stack spacing={2.6} direction="row">
            <button
              className={`CategoryButton ${
                isActive && selectedCategory === "Fruit" ? "active" : ""
              }`}
              onClick={() => handleCategoryClicked("Fruit")}
            >
              Fruit
            </button>
            <button
              className={`CategoryButton ${
                isActive && selectedCategory === "Vegetable" ? "active" : ""
              }`}
              onClick={() => handleCategoryClicked("Vegetable")}
            >
              Vegetable
            </button>
            <button
              className={`CategoryButton ${
                isActive && selectedCategory === "Protein" ? "active" : ""
              }`}
              onClick={() => handleCategoryClicked("Protein")}
            >
              Protein
            </button>
            <button
              className={`CategoryButton ${
                isActive && selectedCategory === "Dairy" ? "active" : ""
              }`}
              onClick={() => handleCategoryClicked("Dairy")}
            >
              Dairy
            </button>
            <button
              className={`CategoryButton ${
                isActive && selectedCategory === "Drinks" ? "active" : ""
              }`}
              onClick={() => handleCategoryClicked("Drinks")}
            >
              Drinks
            </button>
            <button
              className={`CategoryButton ${
                isActive && selectedCategory === "Grains" ? "active" : ""
              }`}
              onClick={() => handleCategoryClicked("Grains")}
            >
              Grains
            </button>
          </Stack>
          <div>
            <div
              className="AllItem"
              style={{ width: "738px", overflow: "scroll" }}
            >
              {items && items.length > 0 ? (
                items.map((item) => (
                  <div
                    className="ItemBlockwNo"
                    key={item.Item_ID}
                    alt="Item block with no of item left"
                    onClick={() => handleItemClicked(item)}
                  >
                    <div className="ItemBlock">
                      <div className="ImageContainer">
                        <img
                          src={`../img/${item.Item_Name.replace(
                            /\s/g,
                            "_"
                          ).toLowerCase()}.png`}
                          onError={(e) => {
                            e.target.src = "../img/default.png";
                          }}
                          className="ItemImage"
                          alt={item.Item_Name}
                        />
                      </div>
                      <div className="ItemName">{item.Item_Name}</div>
                    </div>
                    <div className="RedNoti">
                      <h2 className="NoItemLeft">
                        {isNaN(item.Quantity) ? "N/A" : item.Quantity}
                      </h2>
                    </div>
                  </div>
                ))
              ) : (
                <h2 className="NoItem">There is no item in this category</h2>
              )}
            </div>
          </div>
        </div>
      </div>

      {openItemPopup && selectedItem && (
        <div
          alt="ItemPopup"
          open={openItemPopup}
          onClose={() => setOpenItemPopup(false)}
        >
          <div onClick={() => setOpenItemPopup(false)} className="Overlay">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="ItemPopupContainer">
                <div
                  alt="Black Box"
                  style={{
                    width: "500px",
                    height: "300px",
                    backgroundColor: "#efbf38",
                    borderRadius: "25px",
                  }}
                >
                  <div className="BackBtnAndHistoryBtn">
                    <Link to="/SearchItem">
                      <IconButton>
                        <History
                          style={{
                            color: "black",
                            maxWidth: "35px",
                            maxHeight: "35px",
                            minWidth: "35px",
                            minHeight: "35px",
                          }}
                        />
                      </IconButton>
                    </Link>
                  </div>
                  <h1 className="ItemNamePopup">{selectedItem.Item_Name}</h1>
                  <hr
                    style={{
                      width: "60px",
                      border: "0.1px solid black",
                      marginLeft: "65px",
                    }}
                  />
                  <div className="ImageContainer1">
                    <img
                      className="Image"
                      src={`../img/${selectedItem.Item_Name}.png`}
                      style={{
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.src = "../img/default.png";
                      }}
                      alt={selectedItem.Item_Name}
                    />
                  </div>
                  <h1 className="ItemDetail">Added Date</h1>
                  <div className="Date">
                    {formatDate(selectedItem.Add_Date)}
                  </div>

                  <h1 className="ItemDetail">Expired Date</h1>
                  <div className="Date">{formatDate(selectedItem.Ex_Date)}</div>
                </div>

                <h1 className="LocationText">Location</h1>
                <div className="FridgePopup">
                  <img
                    className="FridgeBody"
                    src="../Fridge_Asset/FridgeBody.png"
                  />

                  <div className="ContainerFridge">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ContainerNumber) => (
                      <div
                        key={ContainerNumber}
                        className={`Container${ContainerNumber} ${
                          ContainerNumber === selectedContainerNo
                            ? "active"
                            : ""
                        }`}
                      ></div>
                    ))}
                  </div>

                  <div className="InstockText">
                    In Stock: {selectedItem.Quantity} pieces
                  </div>
                  <h1 className="TakeOutText">Take-Out</h1>
                  <div className="GroupBtnAndQuan">
                    <div className="Button" onClick={decrementCount}>
                      <h1 className="ButtonText">-</h1>
                    </div>
                    <h2 className="QuantityText">{count}</h2>
                    <div className="Button" onClick={incrementCount}>
                      <h1 className="ButtonText">+</h1>
                    </div>
                  </div>
                  <div
                    className="CancelBtn"
                    onClick={() => {
                      handleCancelButton();
                    }}
                  >
                    <h2 className="CancelText">Cancel</h2>
                  </div>
                  <div
                    className="TakeOutBtn"
                    disabled={loading}
                    onClick={() => {
                      handleConfirmClick();
                    }}
                  >
                    <h2 className="ConfirmText">Confirm</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {openSuccessPopup && (
        <div
          className="Overlay"
          open={openSuccessPopup}
          onClose={() => setOpenSuccessPopup(false)}
        >
          <div
            onClick={() => setOpenSuccessPopup(false)}
            className="SuccessPopup"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <CheckCircleOutlineIcon
                className="CheckIcon"
                sx={{
                  fontSize: "25px",
                  width: "100px",
                  height: "100px",
                  color: "white",
                }}
              />
              <h2 className="SuccessfullyTakeOutText">Successfully Take Out</h2>
              <div
                className="DoneBtn"
                onClick={() => {
                  setOpenSuccessPopup(false);
                }}
              >
                <h2 className="DoneText">DONE</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
