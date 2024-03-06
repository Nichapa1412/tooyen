// Natty modified at 9 December 2023 : I updated the code as the refactored code. 

import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import "./css/AddToList.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FilterListIcon from "@mui/icons-material/FilterList";
import Stack from "@mui/material/Stack";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";

const formatDate = (dateString) => {
  if (dateString === null || dateString === "") {
    return "-";
  }

  const datee = new Date(dateString);

  const day = datee.getDate();
  const month = datee.getMonth() + 1;
  const year = datee.getFullYear();

  const paddedDay = day < 10 ? `0${day}` : day;
  const paddedMonth = month < 10 ? `0${month}` : month;

  // Create the "dd-mm-yyyy" format
  return `${paddedDay}-${paddedMonth}-${year}`;
};

export default function AddToList() {
  const [searchItems, setSearchItems] = useState([]);
  const [suggestItems, setSuggestItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSuggest, setIsLoadingSuggest] = useState(true);
  const [itemQuantities, setItemQuantities] = useState([]);
  const [itemQuantitiesSuggest, setItemQuantitiesSuggest] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSuggestItem, setIsSuggestItem] = useState(false);

  const [newItem, setNewItem] = useState("");

  const [previousCategory, setPreviousCategory] = useState("none");
  const [nowSelectedCategory, setNowSelectedCategory] = useState("none");
  const [selectedCategory, setSelectedCategory] = useState("none");

  const [listItemFound, setListItemFound] = useState([]);
  const [listLastShopping, setListLastShopping] = useState([]);

  const scrollableContainer = document.querySelector(".scrollable-container");
  const specificPosition = 300;

  if (scrollableContainer) {
    scrollableContainer.scrollTop = specificPosition;
  }

  useEffect(() => {
    const fetchSearchedItems = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/shoplist/searchItem?searchWord=${searchQuery}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data && data.items && Array.isArray(data.items)) {
          setSearchItems(data.items);
          const initialListQuantity = data.items.map((item) => 1);
          setItemQuantities(initialListQuantity);
          setIsSuggestItem(false); // Set to false for searched items
        } else {
          console.error("Invalid data format received from the API");
          setSearchItems([]);
        }
      } catch (error) {
        console.error("Error fetching items: ", error);
        setSearchItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchedItems();
    } else {
      setSearchItems([]);
      setItemQuantities([]);
      setIsSuggestItem(true);
      setIsLoading(false);
    }

    return () => {
      setIsLoading(false);
    };
  }, [searchQuery]);

  const fetchSuggestedItems = async () => {
    setIsLoadingSuggest(true);

    try {
      const response = await fetch(
        `http://localhost:5000/shoplist/suggestedItem`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data && data.items && Array.isArray(data.items)) {
        setSuggestItems(data.items);
        const initialListQuantitySuggest = data.items.map((item) => 1);
        setItemQuantitiesSuggest(initialListQuantitySuggest);
        setIsSuggestItem(true);
      } else {
        console.error("Invalid data format received from the API");
        setSuggestItems([]);
      }
    } catch (error) {
      console.error("Error fetching suggested items: ", error);
      setSuggestItems([]);
    } finally {
      setIsLoadingSuggest(false);
    }
  };

  useEffect(() => {
    fetchSuggestedItems();

    return () => {
      setIsLoadingSuggest(false);
    };
  }, []);

  const resetItemQuantities = () => {
    setItemQuantities(Array(searchItems.length).fill(1));
    setItemQuantitiesSuggest(Array(suggestItems.length).fill(1));
  };

  const listSuggestedItem = suggestItems.map((item) => item.Item_Name);
  const listSuggestedCategory = suggestItems.map((item) => item.Tag_Name);
  const listSuggestedLastShop = suggestItems.map((item) =>
    formatDate(item.Last_Purchase)
  );

  const listCategory = searchItems.map((item) => item.Tag_Name);

  useEffect(() => {
    const filteredItems = searchItems.filter((item) => {
      return selectedCategory === "none" || item.Tag_Name === selectedCategory;
    });

    const mappedItemNames = filteredItems.map((item) => item.Item_Name);
    const mappedLastShopping = filteredItems.map((item) =>
      formatDate(item.Last_Purchase)
    );

    setListItemFound(mappedItemNames);
    setListLastShopping(mappedLastShopping);
  }, [selectedCategory, searchItems]);

  const confirmShopping = (item, quantity) => {
    const quantityValue =
      typeof quantity === "object" ? quantity.quantity : quantity;

    axios
      .post(`http://localhost:5000/shoplist/addToList/${item}/${quantityValue}`)
      .then((response) => {
        if (response.status === 200) {
          handleOpenDeletedNotification(item);
          handleClosePopup();
          console.log("Item added to the shopping list:", item);
        } else {
          console.error("Error adding item to the shopping list");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [selected, setSelected] = React.useState([]);

  function handleSelect(event, name) {
    if (event.target.checked) {
      setSelected([...selected, name]);
    } else {
      setSelected(selected.filter((item) => item !== name));
    }
  }

  //Description : this is used for confirmation popup 
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const handleOpenPopup = (item, index) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
    setSelectedItemIndex(null);
    setPopupOpen(false);
  };

  const incrementQuantity = (index) => {
    const updatedQuantities = isSuggestItem
      ? [...itemQuantitiesSuggest]
      : [...itemQuantities];

    updatedQuantities[index] += 1;
    isSuggestItem
      ? setItemQuantitiesSuggest(updatedQuantities)
      : setItemQuantities(updatedQuantities);
  };

  const decrementQuantity = (index) => {
    const updatedQuantities = isSuggestItem
      ? [...itemQuantitiesSuggest]
      : [...itemQuantities];

    if (updatedQuantities[index] > 1) {
      updatedQuantities[index] -= 1;
      isSuggestItem
        ? setItemQuantitiesSuggest(updatedQuantities)
        : setItemQuantities(updatedQuantities);
    }
  };

  //Description : this is used for popup the adding item to shopping list succesfully
  const [isDeletedNotificationOpen, setIsDeletedNotificationOpen] =
    useState(false);

  const handleOpenDeletedNotification = (item) => {
    handleClosePopup();
    setIsDeletedNotificationOpen(true);
  };

  const handleCloseDeletedNotification = () => {
    setIsDeletedNotificationOpen(false);
    const initQty = Array.from({ length: itemQuantities.length }, () => 1);
    const initQtySuggest = Array.from(
      { length: itemQuantitiesSuggest.length },
      () => 1
    );
    setItemQuantities(initQty);
    setItemQuantitiesSuggest(initQtySuggest);
  };

  const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
  //Description : this is used for adding new item to database succesfully
  const [isAddedNewItemOpen, setIsAddedNewItemOpen] = useState(false);
  //Description : this is used for pop selecting category
  const [isFilterSearch, setIsFilterSearch] = useState(false);
  const [IsActive, setIsActive] = useState(true);
  const [IsActive1, setIsActive1] = useState(true);
  //Description : this is used for selecting category -new item
  const [SelectedCategory1, setSelectedCategory1] = useState("Fruit");

  //Description : this is used for adding the new items to database
  const openAddNewItemModal = () => {
    setAddItemModalOpen(true);
  };

  const closeAddNewItemModal = () => {
    setAddItemModalOpen(false);
    setSelectedCategory1("Fruit");
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenAddedNewItem = () => {
    handleClosePopup();
    setIsAddedNewItemOpen(true);
  };

  const handleCloseAddedNewItem = () => {
    setIsAddedNewItemOpen(false);
  };

  const handleOpenFilterSearch = () => {
    setIsFilterSearch(true);
  };

  const handleCloseFilterSearch = () => {
    setIsFilterSearch(false);
  };

  const handleCategoryClicked = (Category) => {
    setNowSelectedCategory((prevCategory) => {
      return prevCategory === Category ? "none" : Category;
    });
  };

  const handleCategoryClicked1 = (Category) => {
    setSelectedCategory1(Category);
    setIsActive1(true);
  };

  const handleNewItemChange = (event) => {
    setNewItem(event.target.value);
  };

  const handleCanceled = () => {
    setNowSelectedCategory(previousCategory);
  };

  const handleConfirm = () => {
    setSelectedCategory(nowSelectedCategory);
    setNowSelectedCategory(nowSelectedCategory);
    setPreviousCategory(nowSelectedCategory);
  };

  const handleInsertNewItem = (inputWord, tag) => {
    const data = {
      InputWord: inputWord,
      Tag_Name: tag,
    };

    fetch("http://localhost:5000/shoplist/addNewItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  console.log(itemQuantities);
  return (
    <div className="pageStyle-add">
      <div className="containerStyle-add">
        <div className="square-background-add"></div>
        <div className="square-navigation-bar-add"></div>

        <Link to="/ShoppingList">
          <ArrowBackIosIcon
            className="Arrow-back-button-add"
            sx={{ color: "black", width: "50px", height: "50px" }}
          />
        </Link>

        <div>
          <Routes>
            <Route path="/AddToList" element={<AddIcon />} />
          </Routes>
        </div>

        <div className="Container-add">
          <SearchIcon
            className="SearchIcon-add"
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
            className="SearchInput-add"
            spellCheck="true"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>

        <IconButton
          className="filter-button-icon-add"
          onClick={handleOpenFilterSearch}
        >
          <FilterListIcon
            className="filter-icon-add"
            style={{ width: "70px", height: "70px" }}
          />
        </IconButton>

        <div className="Header-add">Add to Shopping List</div>
        <img
          className="Shopping-cart-add"
          src="../ShoppingList_Asset/Shoppingcart.png"
        />

        {searchQuery.trim() === "" ? (
          <div>
            <h1 className="item-found-add">Suggested Items</h1>
          </div>
        ) : (
          <div>
            <h1 className="item-found-add">
              Item Found ({listItemFound.length})
            </h1>
          </div>
        )}

        {searchQuery.trim() === "" ? (
          <div>
            {listSuggestedItem.length === 0 ? (
              <div>
                <div className="circle-no-item-found-add">
                  <img
                    className="no-suggested-item-pic-add"
                    src="../ShoppingList_Asset/no-item-found.jpeg"
                    alt="No item found"
                  />
                </div>
                <h1 className="no-suggested-item-add">
                  Let's try adding some items to the shopping list
                </h1>
              </div>
            ) : null}
            <div>
              <Fab
                className="new-item-icon-add"
                sx={{
                  width: "75px",
                  height: "75px",
                  backgroundColor: "#3E424B",
                  "&:hover": { backgroundColor: "#c1c1c1" },
                }}
                onClick={openAddNewItemModal}
              >
                <AddIcon
                  sx={{ width: "50px", height: "50px", color: "#FFFFFF" }}
                />
              </Fab>
              <div
                className="scrollable-container-add"
                style={{ marginLeft: "15px" }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Grid
                    container
                    spacing={4}
                    style={{ gridGap: "30px", marginBottom: "40px" }}
                  >
                    {listSuggestedItem.map((item, index) => (
                      <div className="square-list-add" key={item}>
                        <Button
                          variant="contained"
                          className="out-of-stock-button-add"
                          style={{
                            fontFamily: "SF UI Display-Bold, Helvetica",
                          }}
                        >
                          Out of stock
                        </Button>
                        <h1 className="item-text-add">{item}</h1>
                        <img
                          className="List-pic-add"
                          src={`../img/${item
                            .replace(/\s/g, "_")
                            .toLowerCase()}.png`}
                          alt={`Image of ${item}`}
                          style={{
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.src = "../img/default.png";
                          }}
                        />
                        <IconButton
                          aria-label="ShoppingBasketOutlined"
                          className="shopping-basket-add"
                          onClick={() => handleOpenPopup(item, index)}
                        >
                          <ShoppingBasketOutlinedIcon
                            sx={{
                              width: "35px",
                              height: "35px",
                              color: "black",
                            }}
                          />
                        </IconButton>
                        <Button variant="contained" className="category-add">
                          Category: {listSuggestedCategory[index]}
                        </Button>
                        <Button
                          variant="contained"
                          className="last-shopping-add"
                        >
                          Last shopping: {listSuggestedLastShop[index]}
                        </Button>
                      </div>
                    ))}
                  </Grid>
                </Box>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {listItemFound.length === 0 ? (
              <div>
                <div className="circle-no-item-found-add">
                  <img
                    className="no-item-found-pic"
                    src="../ShoppingList_Asset/no-item-found2.jpeg"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div
                  className="square-add-new-item-add"
                  onClick={() => openAddNewItemModal()}
                >
                  <div className="add-new-item-text-add">ADD NEW ITEMS</div>
                  <AddCircleIcon
                    className="add-circle-icon-add"
                    style={{ width: "50px", height: "50px" }}
                  ></AddCircleIcon>
                </div>
              </div>
            ) : (
              <div
                className="scrollable-container-found-add"
                style={{ marginLeft: "15px" }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Grid
                    container
                    spacing={4}
                    style={{ gridGap: "30px", marginBottom: "40px" }}
                  >
                    {listItemFound.map((item, index) => (
                      <div className="square-list-add" key={item}>
                        <h1 className="item-text-found-add">{item}</h1>

                        <img
                          className="List-pic-found-add"
                          src={`../img/${item
                            .replace(/\s/g, "_")
                            .toLowerCase()}.png`}
                          alt={`Image of ${item}`}
                          style={{
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.src = "../img/default.png";
                          }}
                        />
                        <Button
                          variant="contained"
                          className="category-found-add"
                        >
                          Category : {listCategory[index]}
                        </Button>
                        <Button
                          variant="contained"
                          className="last-shopping-found-add"
                        >
                          Last shopping: {listLastShopping[index]}
                        </Button>
                        <IconButton
                          aria-label="ShoppingBasketOutlined"
                          className="shopping-basket-found-add"
                          onClick={() => handleOpenPopup(item, index)}
                        >
                          <ShoppingBasketOutlinedIcon
                            sx={{
                              width: "35px",
                              height: "35px",
                              color: "black",
                            }}
                          />
                        </IconButton>
                      </div>
                    ))}
                  </Grid>
                </Box>
              </div>
            )}
          </div>
        )}

        <Modal
          open={isPopupOpen}
          onClose={handleClosePopup}
          aria-labelledby="popup-title"
          aria-describedby="popup-description"
        >
          <div className="popup-content-add">
            <h1 className="popup-title-add">Add to Shopping List</h1>
            {selectedItem && selectedItemIndex !== null && (
              <p className="popup-description-add">{selectedItem}</p>
            )}

            {selectedItemIndex !== null && (
              <div>
                <img
                  className="popup-pic-add"
                  src={`../img/${selectedItem
                    .replace(/\s/g, "_")
                    .toLowerCase()}.png`}
                  alt={`Image of ${selectedItem}`}
                  style={{
                    //width: "25%",
                    //height: "60%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src = "../img/default.png";
                  }}
                />

                <div className="square-quantity-add">
                  <div className="count-display-add">
                    {isSuggestItem
                      ? itemQuantitiesSuggest[selectedItemIndex]
                      : itemQuantities[selectedItemIndex]}
                  </div>

                  <Button
                    variant="contained"
                    color="inherit"
                    className="decrement-button-add"
                    onClick={() => decrementQuantity(selectedItemIndex)}
                    sx={{ fontSize: "25px", width: "10px", height: "40px" }}
                  >
                    -
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    className="increment-button-add"
                    onClick={() => incrementQuantity(selectedItemIndex)}
                    sx={{ fontSize: "20px", width: "10px", height: "40px" }}
                  >
                    +
                  </Button>
                  <div className="checkout-quantity-text-sl">Quantity</div>
                </div>
              </div>
            )}

            <div
              className="CancelBtn-add-to-shop-add"
              onClick={() => {
                handleClosePopup();
                resetItemQuantities();
              }}
            >
              <h2 className="CancelText-add">Cancel</h2>
            </div>

            <div
              className="TakeOutBtn-add-to-shop-add"
              onClick={() => {
                confirmShopping(selectedItem, {
                  quantity: isSuggestItem
                    ? itemQuantitiesSuggest[selectedItemIndex]
                    : itemQuantities[selectedItemIndex],
                });
              }}
            >
              <h2 className="ConfirmText-add">Confirm</h2>
            </div>
          </div>
        </Modal>

        <Modal
          open={isDeletedNotificationOpen}
          onClose={handleCloseDeletedNotification}
          aria-labelledby="second-popup-title"
          aria-describedby="second-popup-description"
        >
          <div className="complete-added-popup-content-add">
            <CheckCircleOutlineIcon
              className="sucessfully-added-icon-add"
              sx={{
                fontSize: "25px",
                width: "100px",
                height: "100px",
                color: "white",
              }}
            />

            <h2 className="complete-added-popup-title-add">
              {" "}
              Item has been added to shopping list
            </h2>
            <Button
              className="done-added-button-add"
              variant="contained"
              color="info"
              onClick={handleCloseDeletedNotification}
              sx={{
                fontSize: "20px",
                color: "black",
                backgroundColor: "white",
                "&:hover": { backgroundColor: "#c1c1c1" },
              }}
            >
              DONE
            </Button>
          </div>
        </Modal>

        <Modal
          open={isAddItemModalOpen}
          onClose={closeAddNewItemModal}
          aria-labelledby="add-item-modal-title"
          aria-describedby="add-item-modal-description"
        >
          <div className="add-new-item-content-add">
            <h1 className="add-new-item-title-add">Add new item</h1>

            <div className="new-item-name-add">
              <h1 className="new-item-name-text-add">Name: </h1>

              <FormControl sx={{ width: "30rem" }} variant="outlined">
                <OutlinedInput
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end"></InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  value={newItem}
                  onChange={handleNewItemChange}
                />
              </FormControl>
            </div>

            <h1 className="new-item-category-text-add">Category: </h1>
            <div className="outline-new-item-category-add">
              <div className="AllCategoryButton2-add">
                <Stack spacing={5} direction="row">
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Fruit" ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClicked1("Fruit")}
                  >
                    <div>
                      <img
                        className="Fruits-add"
                        src="../ShoppingList_Asset/Fruit.png"
                      />
                    </div>
                    Fruit
                  </button>
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Vegetable"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleCategoryClicked1("Vegetable")}
                  >
                    <img
                      className="Vegetable-add"
                      src="../ShoppingList_Asset/Vegetable.png"
                    />
                    Vegetable
                  </button>
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Protein"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleCategoryClicked1("Protein")}
                  >
                    <img
                      className="Protein-add"
                      src="../ShoppingList_Asset/Protein.png"
                    />
                    Protein
                  </button>
                </Stack>
              </div>
              <div className="AllCategoryButton2-add">
                <Stack spacing={5} direction="row">
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Dairy" ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClicked1("Dairy")}
                  >
                    <img
                      className="Dairy-add"
                      src="../ShoppingList_Asset/Dairy.png"
                    />
                    Dairy
                  </button>
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Drinks"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleCategoryClicked1("Drinks")}
                  >
                    <img
                      className="Drinks-add"
                      src="../ShoppingList_Asset/Drinks.png"
                    />
                    Drinks
                  </button>
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Grains"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleCategoryClicked1("Grains")}
                  >
                    <img
                      className="Grains-add"
                      src="../ShoppingList_Asset/Grains.png"
                    />
                    Grains
                  </button>
                </Stack>
              </div>
            </div>
            <div className="CancelBtn-added-add" onClick={closeAddNewItemModal}>
              <h2 className="CancelText-add">Cancel</h2>
            </div>

            <div
              className={`TakeOutBtn-added-add ${
                !newItem || !SelectedCategory1 ? "disable" : ""
              }`}
              onClick={() => {
                if (newItem && SelectedCategory1) {
                  handleInsertNewItem(newItem, SelectedCategory1);
                  handleOpenAddedNewItem();
                  closeAddNewItemModal();
                }
              }}
            >
              <h2 className="ConfirmText-add">Confirm</h2>
            </div>
          </div>
        </Modal>

        <Modal
          open={isAddedNewItemOpen}
          onClose={handleCloseAddedNewItem}
          aria-labelledby="add-new-item-popup-title"
          aria-describedby="add-new-item-popup-description"
        >
          <div className="complete-added-popup-content-add">
            <CheckCircleOutlineIcon
              className="sucessfully-added-icon-add"
              sx={{
                fontSize: "25px",
                width: "100px",
                height: "100px",
                color: "white",
              }}
            />

            <h2 className="complete-added-popup-title-add">
              {" "}
              Item has been added to the fridge
            </h2>
            <Button
              className="done-added-button-add"
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
          </div>
        </Modal>

        <Modal
          open={isFilterSearch}
          onClose={handleCloseFilterSearch}
          aria-labelledby="filter-search-popup-title"
        >
          <div className="filter-search-content-add">
            <h2 className="filter-search-title-add"> Select Category</h2>

            <div className="AllCategoryButton-add">
              <Stack spacing={5} direction="row">
                <button
                  className={`CategoryButton-add ${
                    IsActive && nowSelectedCategory === "Fruit" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClicked("Fruit")}
                >
                  <div>
                    <img
                      className="Fruits-add"
                      src="../ShoppingList_Asset/Fruit.png"
                    />
                  </div>
                  Fruit
                </button>

                <button
                  className={`CategoryButton-add ${
                    IsActive && nowSelectedCategory === "Vegetable"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleCategoryClicked("Vegetable")}
                >
                  <img
                    className="Vegetable-add"
                    src="../ShoppingList_Asset/Vegetable.png"
                  />
                  Vegetable
                </button>
                <button
                  className={`CategoryButton-add ${
                    IsActive && nowSelectedCategory === "Protein"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleCategoryClicked("Protein")}
                >
                  <img
                    className="Protein-add"
                    src="../ShoppingList_Asset/Protein.png"
                  />
                  Protein
                </button>
              </Stack>
            </div>
            <div className="AllCategoryButton-add">
              <Stack spacing={5} direction="row">
                <button
                  className={`CategoryButton-add ${
                    IsActive && nowSelectedCategory === "Dairy" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClicked("Dairy")}
                >
                  <img
                    className="Dairy-add"
                    src="../ShoppingList_Asset/Dairy.png"
                  />
                  Dairy
                </button>
                <button
                  className={`CategoryButton-add ${
                    IsActive && nowSelectedCategory === "Drinks" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClicked("Drinks")}
                >
                  <img
                    className="Drinks-add"
                    src="../ShoppingList_Asset/Drinks.png"
                  />
                  Drinks
                </button>
                <button
                  className={`CategoryButton-add ${
                    IsActive && nowSelectedCategory === "Grains" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClicked("Grains")}
                >
                  <img
                    className="Grains-add"
                    src="../ShoppingList_Asset/Grains.png"
                  />
                  Grains
                </button>
              </Stack>
            </div>

            <div>
              <div
                className="CancelBtn-category-add"
                onClick={() => {
                  handleCanceled();
                  handleCloseFilterSearch();
                }}
              >
                <h2 className="CancelText-add">Cancel</h2>
              </div>

              <div
                className="TakeOutBtn-category-add"
                onClick={() => {
                  handleConfirm();
                  handleCloseFilterSearch();
                }}
              >
                <h2 className="ConfirmText-add">Confirm</h2>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
