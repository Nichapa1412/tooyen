// Description: This code is part of the SearchItem.js. This code will display when the plus button on
// on the top right corner. This AddToFridge page is for adding to fridge without going through the process
// of shopping list.
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./css/AddToFridge.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { experimentalStyled as styled } from "@mui/material/styles";
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
  const scrollableContainer = document.querySelector(".scrollable-container");
  const specificPosition = 300;
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
          setIsSuggestItem(false);
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

  const insertToFridge = async (itemData) => {
    try {
      await axios.post(`http://localhost:5000/home/insertInstant`, itemData);
      setIsAddedNewItemOpen(true);
      fetchSuggestedItems();
      setItemDurations({});
      setItemContainers({});
      resetItemQuantities();

      console.log("Item inserted successfully!");
    } catch (error) {
      console.error("Error inserting item into the fridge:", error.message);
      throw error;
    }
  };

  const confirmShopping = async () => {
    handleClosePopup();

    const itemName = selectedItem;
    console.log("SNDNDSN: ", itemName);
    const locNum = itemContainers[selected[currentShoppingIndex]];
    const setDur = parseInt(itemDurations[selected[currentShoppingIndex]], 10);
    const quantity = isSuggestItem
      ? itemQuantitiesSuggest[currentShoppingIndex]
      : itemQuantities[currentShoppingIndex];

    const itemData = {
      itemName: itemName,
      Loc_Num: locNum,
      Set_Dur: setDur,
      Quantity: quantity,
    };

    console.log("Item data: ", itemData);

    try {
      await insertToFridge(itemData);
      setLastItemConfirmed(true);
      closeCheckoutModal();
      handleOpenAddedNotification(selectedItem);
    } catch (error) {
      console.error(
        "Error confirming shopping for a single item:",
        error.message
      );
    }
  };

  const [selected, setSelected] = React.useState([]);

  function handleSelect(name) {
    if (selected.includes(name)) {
      setSelected(selected.filter((item) => item !== name));
    } else {
      setSelected([...selected, name]);
    }
  }

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

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const handleOpenPopup = (item, index) => {
    handleSelect(item);
    setSelectedItem(item);
    setSelectedItemIndex(index);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelected([]);
    setSelectedItem(null);
    setSelectedItemIndex(null);
    setPopupOpen(false);
  };

  const handleClosePopupS = () => {
    setCurrentShoppingIndex(selectedItemIndex);
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

  const [isDeletedNotificationOpen, setIsDeletedNotificationOpen] =
    useState(false);

  const [isShoppingListModalOpen, setShoppingListModalOpen] = useState(false);
  const [currentShoppingIndex, setCurrentShoppingIndex] = useState(0);
  const [shoppingList, setShoppingList] = useState([]);
  const [lastItemConfirmed, setLastItemConfirmed] = useState(false);
  const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);

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

  const [category, setCategory] = React.useState("");

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const [isAddedNewItemOpen, setIsAddedNewItemOpen] = useState(false);

  const handleOpenAddedNewItem = () => {
    handleClosePopup();
    setIsAddedNewItemOpen(true);
  };

  const handleCloseAddedNewItem = () => {
    setIsAddedNewItemOpen(false);
  };

  const [isFilterSearch, setIsFilterSearch] = useState(false);

  const handleOpenFilterSearch = () => {
    setIsFilterSearch(true);
  };

  const handleCloseFilterSearch = () => {
    setIsFilterSearch(false);
  };

  const HandleCategoryClicked = (Category) => {
    setNowSelectedCategory((prevCategory) => {
      return prevCategory === Category ? "none" : Category;
    });
  };

  const [SelectedCategory1, setSelectedCategory1] = useState("Fruit");

  const [IsActive1, setIsActive1] = useState(true);

  const HandleCategoryClicked1 = (Category) => {
    setSelectedCategory1(Category);
    setIsActive1(true);
  };

  const handleNewItemChange = (event) => {
    setNewItem(event.target.value);
  };

  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const closeCheckoutModal = () => {
    setSelected([]);
    setCheckoutModalOpen(false);
    setCurrentShoppingIndex(0);
  };

  const [itemDurations, setItemDurations] = useState({});
  const [itemContainers, setItemContainers] = useState({});
  const handleSelectContainer = (itemName, containerNumber) => {
    setItemContainers({ ...itemContainers, [itemName]: containerNumber });
  };
  const updateDuration = (itemName, duration) => {
    setItemDurations({ ...itemDurations, [itemName]: duration });
  };

  const handleCanceled = () => {
    setNowSelectedCategory(previousCategory);
  };

  const handleConfirm = () => {
    setSelectedCategory(nowSelectedCategory);
    setNowSelectedCategory(nowSelectedCategory);
    setPreviousCategory(nowSelectedCategory);
  };

  const handleOpenAddedNotification = () => {
    setIsAddedNotificationOpen(true);
  };
  const [isAddedNotificationOpen, setIsAddedNotificationOpen] = useState(false);

  console.log("selectedCategory: ", selectedCategory);
  console.log("nowSelectedCategory: ", nowSelectedCategory);
  console.log("previousCategory: ", previousCategory);

  const handleCanceledAdd = () => {
    setItemDurations({});
    resetItemQuantities();
    setItemContainers({});
  };

  // Display 2 mode of item which is fridge mode and list mode
  return (
    <div className="AddToFridgePage">
      <div className="AtfPageBorder">
        <div className="AtfWhiteBox" />

        <Link to="/SearchItem">
          <IconButton className="AtfBackBtn">
            <ArrowBackIosIcon
              sx={{ color: "black", width: "50px", height: "50px" }}
            />
          </IconButton>
        </Link>

        <div className="AtfContainer-add">
          <SearchIcon
            className="AtfSearchIcon-add"
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
            className="AtfSearchInput-add"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <IconButton
          className="Atffilter-button-icon-add"
          onClick={handleOpenFilterSearch}>
          <FilterListIcon style={{ width: "70px", height: "70px" }} />
        </IconButton>

        <div className="AtfHeader-add">Add to fridge</div>
        <img
          className="AtfAddToFridgeIcon"
          src="../Fridge_Asset/AddToFridge.png"
        />

        {listSuggestedItem.length === 0 ? (
          <div>
            <div className="Atfcircle-no-item-found-add">
              <img
                className="Atfno-suggested-item-pic-add"
                src="../ShoppingList_Asset/no-item-found.jpeg"
              />
            </div>
            <h1 className="Atfno-suggested-item-add">
              Let's try add some items into shopping list
            </h1>
          </div>
        ) : null}

        {searchQuery.trim() === "" ? (
          <div>
            <h1 className="Atfitem-found-add">Suggested Items</h1>
          </div>
        ) : (
          <div>
            <h1 className="Atfitem-found-add">
              Item Found ({listItemFound.length})
            </h1>
          </div>
        )}

        {searchQuery.trim() === "" ? (
          <div>
            <Fab
              className="Atfnew-item-icon-add"
              sx={{
                width: "75px",
                height: "75px",
                backgroundColor: "#3E424B",
                "&:hover": { backgroundColor: "#DDD" },
              }}
              onClick={() => openAddNewItemModal()}>
              <AddIcon
                sx={{ width: "50px", height: "50px", color: "#FFFFFF" }}
              />
            </Fab>
            <div
              className="Atfscrollable-container-add"
              style={{ marginLeft: "15px" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  spacing={4}
                  style={{ gridGap: "30px", marginBottom: "40px" }}>
                  {listSuggestedItem.map((item, index) => (
                    <div className="Atfsquare-list-add" key={item}>
                      <Button
                        variant="contained"
                        className="Atfout-of-stock-button-add"
                        style={{ fontFamily: "SF UI Display-Bold, Helvetica" }}>
                        Out of stock
                      </Button>
                      <h1 className="Atfitem-text-add">{item}</h1>

                      <img
                        className="AtfList-pic-add"
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
                        className="Atfshopping-basket-add"
                        onClick={() => handleOpenPopup(item, index)}>
                        <ShoppingBasketOutlinedIcon
                          sx={{ width: "35px", height: "35px", color: "black" }}
                        />
                      </IconButton>
                      <Button variant="contained" className="Atfcategory-add">
                        Category : {listSuggestedCategory[index]}
                      </Button>
                      <Button
                        variant="contained"
                        className="Atflast-shopping-add">
                        Last shopping: {listSuggestedLastShop[index]}
                      </Button>
                    </div>
                  ))}
                </Grid>
              </Box>
            </div>
          </div>
        ) : (
          <div>
            {listItemFound.length === 0 ? (
              <div>
                <div className="Atfcircle-no-item-found-add">
                  <img
                    className="Atfno-item-found-pic-add"
                    src="../ShoppingList_Asset/no-item-found2.jpeg"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div
                  className="Atfsquare-add-new-item-add"
                  onClick={() => openAddNewItemModal()}>
                  <div className="Atfadd-new-item-text-add">ADD NEW ITEMS</div>
                  <AddCircleIcon
                    className="Atfadd-circle-icon-add"
                    style={{ width: "50px", height: "50px" }}></AddCircleIcon>
                </div>
              </div>
            ) : (
              <div
                className="Atfscrollable-container-found-add"
                style={{ marginLeft: "15px" }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid
                    container
                    spacing={4}
                    style={{ gridGap: "30px", marginBottom: "40px" }}>
                    {listItemFound.map((item, index) => (
                      <div className="Atfsquare-list-add" key={item}>
                        <h1 className="Atfitem-text-found-add">{item}</h1>

                        <img
                          className="AtfList-pic-found-add"
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
                          className="Atfcategory-found-add">
                          Category : {listCategory[index]}
                        </Button>
                        <Button
                          variant="contained"
                          className="Atflast-shopping-found-add">
                          Last shopping: {listLastShopping[index]}
                        </Button>
                        <IconButton
                          aria-label="ShoppingBasketOutlined"
                          className="Atfshopping-basket-found-add"
                          onClick={() => {
                            handleOpenPopup(item, index);
                          }}>
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

        {/* Popup When Add Item to Fridge */}
        <Modal open={isPopupOpen} onClose={handleClosePopup}>
          <div className="Atfpopup-content-add">
            <h1 className="Atfpopup-title-add">Add to fridge</h1>
            {selectedItem && selectedItemIndex !== null && (
              <p className="Atfpopup-description-add">{selectedItem}</p>
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

                <div className="Atfsquare-quantity-add">
                  <div className="Atfcount-display-add">
                    {isSuggestItem
                      ? itemQuantitiesSuggest[selectedItemIndex]
                      : itemQuantities[selectedItemIndex]}
                  </div>

                  <Button
                    variant="contained"
                    color="inherit"
                    className="Atfdecrement-button-add"
                    onClick={() => decrementQuantity(selectedItemIndex)}
                    sx={{ fontSize: "25px", width: "10px", height: "40px" }}>
                    -
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    className="Atfincrement-button-add"
                    onClick={() => incrementQuantity(selectedItemIndex)}
                    sx={{ fontSize: "20px", width: "10px", height: "40px" }}>
                    +
                  </Button>
                  <div className="AtfQuantity-text-add">Quantity</div>
                </div>
              </div>
            )}

            <div
              className="AtfCancelBtn-add-to-shop-add"
              onClick={() => {
                handleClosePopup();
                handleCanceledAdd();
              }}>
              <h2 className="AtfCancelText-add">Cancel</h2>
            </div>
            <div
              className="AtfTakeOutBtn-add-to-shop-add"
              onClick={() => {
                setCheckoutModalOpen(true);
                handleClosePopupS();
              }}>
              <h2 className="AtfConfirmText-add">Next</h2>
            </div>
          </div>
        </Modal>

        {/* Popup for filter search */}
        <Modal open={isFilterSearch} onClose={handleCloseFilterSearch}>
          <div className="Atffilter-search-content-add">
            <h2 className="Atffilter-search-title-add"> Select Category</h2>

            <div className="AtfAllCategoryButton2-add">
              <Stack spacing={5} direction="row">
                <button
                  className={`CategoryButton-add ${
                    IsActive1 && nowSelectedCategory === "Fruit" ? "active" : ""
                  }`}
                  onClick={() => HandleCategoryClicked("Fruit")}>
                  <img
                    className="SearchItemCategoryImageContainer"
                    src="../Fridge_Asset/Fruit.png"
                  />
                  <div
                    style={{
                      fontFamily: "SF UI Display-Thin, Helvetica",
                      fontSize: "20px",
                      marginTop: "10px",
                    }}>
                    Fruit
                  </div>
                </button>
                <button
                  className={`CategoryButton-add ${
                    IsActive1 && nowSelectedCategory === "Vegetable"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => HandleCategoryClicked("Vegetable")}>
                  <img
                    className="SearchItemCategoryImageContainer"
                    src="../Fridge_Asset/Vegetable.png"
                  />
                  <div
                    style={{
                      fontFamily: "SF UI Display-Thin, Helvetica",
                      fontSize: "20px",
                      marginTop: "10px",
                    }}>
                    Vegetable
                  </div>
                </button>
                <button
                  className={`CategoryButton-add ${
                    IsActive1 && nowSelectedCategory === "Protein"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => HandleCategoryClicked("Protein")}>
                  <img
                    className="SearchItemCategoryImageContainer"
                    src="../Fridge_Asset/Protein.png"
                  />
                  <div
                    style={{
                      fontFamily: "SF UI Display-Thin, Helvetica",
                      fontSize: "20px",
                      marginTop: "10px",
                    }}>
                    Protein
                  </div>
                </button>
              </Stack>
            </div>
            <div className="AtfAllCategoryButton2-add">
              <Stack spacing={5} direction="row">
                <button
                  className={`CategoryButton-add ${
                    IsActive1 && nowSelectedCategory === "Dairy" ? "active" : ""
                  }`}
                  onClick={() => HandleCategoryClicked("Dairy")}>
                  <img
                    className="SearchItemCategoryImageContainer1"
                    src="../Fridge_Asset/Dairy.png"
                  />

                  <div
                    style={{
                      fontFamily: "SF UI Display-Thin, Helvetica",
                      fontSize: "20px",
                      marginTop: "10px",
                    }}>
                    Dairy
                  </div>
                </button>
                <button
                  className={`CategoryButton-add ${
                    IsActive1 && nowSelectedCategory === "Drinks"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => HandleCategoryClicked("Drinks")}>
                  <img
                    className="SearchItemCategoryImageContainer1"
                    src="../Fridge_Asset/Drinks.png"
                  />

                  <div
                    style={{
                      fontFamily: "SF UI Display-Thin, Helvetica",
                      fontSize: "20px",
                      marginTop: "10px",
                    }}>
                    Drinks
                  </div>
                </button>
                <button
                  className={`CategoryButton-add ${
                    IsActive1 && nowSelectedCategory === "Grains"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => HandleCategoryClicked("Grains")}>
                  <img
                    className="SearchItemCategoryImageContainer"
                    src="../Fridge_Asset/Grains.png"
                  />

                  <div
                    style={{
                      fontFamily: "SF UI Display-Thin, Helvetica",
                      fontSize: "20px",
                      marginTop: "10px",
                    }}>
                    Grains
                  </div>
                </button>
              </Stack>
            </div>

            <div
              className="AtfCancelBtn-category-add"
              onClick={() => {
                handleCanceled();
                handleCloseFilterSearch();
              }}>
              <h2 className="AtfCancelText-add">Cancel</h2>
            </div>
            <div
              className="AtfTakeOutBtn-category-add"
              onClick={() => {
                handleConfirm();
                handleCloseFilterSearch();
              }}>
              <h2 className="AtfConfirmText-add">Confirm</h2>
            </div>
          </div>
        </Modal>

        {/* Tungtung copied this part from Natty: modified 28 November 2023 */}
        <Modal
          open={isAddItemModalOpen}
          onClose={closeAddNewItemModal}
          aria-labelledby="add-item-modal-title"
          aria-describedby="add-item-modal-description">
          <div className="add-new-item-content-add">
            <h1 className="add-new-item-title-add">Add new item</h1>

            <div className="new-item-name-add">
              <h1 className="new-item-name-text-add">Name: </h1>

              <FormControl sx={{ width: "30rem" }} variant="outlined">
                <OutlinedInput
                  id="outlined-adornment-weight"
                  value={newItem}
                  onChange={handleNewItemChange}
                  endAdornment={
                    <InputAdornment position="end"></InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
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
                    onClick={() => HandleCategoryClicked1("Fruit")}>
                    <img
                      className="SearchItemCategoryImageContainer"
                      src="../Fridge_Asset/Fruit.png"
                    />
                    <div
                      style={{
                        fontFamily: "SF UI Display-Thin, Helvetica",
                        fontSize: "20px",
                        marginTop: "10px",
                      }}>
                      Fruit
                    </div>
                  </button>
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Vegetable"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => HandleCategoryClicked1("Vegetable")}>
                    <img
                      className="SearchItemCategoryImageContainer"
                      src="../Fridge_Asset/Vegetable.png"
                    />
                    <div
                      style={{
                        fontFamily: "SF UI Display-Thin, Helvetica",
                        fontSize: "20px",
                        marginTop: "10px",
                      }}>
                      Vegetable
                    </div>
                  </button>
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Protein"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => HandleCategoryClicked1("Protein")}>
                    <img
                      className="SearchItemCategoryImageContainer"
                      src="../Fridge_Asset/Protein.png"
                    />
                    <div
                      style={{
                        fontFamily: "SF UI Display-Thin, Helvetica",
                        fontSize: "20px",
                        marginTop: "10px",
                      }}>
                      Protein
                    </div>
                  </button>
                </Stack>
              </div>
              <div className="AllCategoryButton2-add">
                <Stack spacing={5} direction="row">
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Dairy" ? "active" : ""
                    }`}
                    onClick={() => HandleCategoryClicked1("Dairy")}>
                    <img
                      className="SearchItemCategoryImageContainer1"
                      src="../Fridge_Asset/Dairy.png"
                    />

                    <div
                      style={{
                        fontFamily: "SF UI Display-Thin, Helvetica",
                        fontSize: "20px",
                        marginTop: "10px",
                      }}>
                      Dairy
                    </div>
                  </button>
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Drinks"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => HandleCategoryClicked1("Drinks")}>
                    <img
                      className="SearchItemCategoryImageContainer1"
                      src="../Fridge_Asset/Drinks.png"
                    />

                    <div
                      style={{
                        fontFamily: "SF UI Display-Thin, Helvetica",
                        fontSize: "20px",
                        marginTop: "10px",
                      }}>
                      Drinks
                    </div>
                  </button>
                  <button
                    className={`CategoryButton-add ${
                      IsActive1 && SelectedCategory1 === "Grains"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => HandleCategoryClicked1("Grains")}>
                    <img
                      className="SearchItemCategoryImageContainer"
                      src="../Fridge_Asset/Grains.png"
                    />

                    <div
                      style={{
                        fontFamily: "SF UI Display-Thin, Helvetica",
                        fontSize: "20px",
                        marginTop: "10px",
                      }}>
                      Grains
                    </div>
                  </button>
                </Stack>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "700px",
                justifyContent: "center",
                gap: "50px",
                marginTop: "42px",
              }}>
              <div
                className="SearchItemCancelBtn"
                onClick={closeAddNewItemModal}>
                <h2 className="SearchItemCancelText">Cancel</h2>
              </div>
              <div
                className={`SearchItemConfirmBtn ${
                  !newItem || !SelectedCategory1 ? "disable" : ""
                }`}
                onClick={() => {
                  if (newItem && SelectedCategory1) {
                    handleInsertNewItem(newItem, SelectedCategory1);
                    handleOpenAddedNewItem();
                    closeAddNewItemModal();
                  }
                }}>
                <h2 className="SearchItemConfirmText">Confirm</h2>
              </div>
            </div>
          </div>
        </Modal>

        {/* Tungtung copied this part from Natty: modified 28 November 2023 */}
        <Modal open={isCheckoutModalOpen} onClose={closeCheckoutModal}>
          <div className="checkout-modal-content-atf">
            <h1 className="checkout-popup-title-atf">Location & Duration</h1>

            <div>
              <div className="checkout-location-text-atf">Location</div>
              <div>
                <img
                  className="fridgeBody-atf"
                  src={`../Fridge_Asset/FridgeBody.png`}
                />

                <div className="ContainerFridge">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((containerNumber) => (
                    <div
                      key={containerNumber}
                      className={`Container${containerNumber}-atf hover-effect-atf ${
                        containerNumber ===
                        itemContainers[selected[currentShoppingIndex]]
                          ? "selected-container"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectContainer(
                          selected[currentShoppingIndex],
                          containerNumber
                        )
                      }
                      style={{
                        backgroundColor:
                          containerNumber ===
                          itemContainers[selected[currentShoppingIndex]]
                            ? "#fdf885"
                            : "",
                      }}>
                      <span className="container-number">
                        {containerNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="checkout-duration-text-atf">Duration Time :</div>
              <div className="checkout-duration-days-atf">Days</div>
              <TextField
                className="checkout-duration-atf"
                id="standard-basic"
                label=" "
                variant="standard"
                value={itemDurations[selected[currentShoppingIndex]] || ""}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^\d]/g, "");
                  updateDuration(
                    selected[currentShoppingIndex],
                    e.target.value
                  );
                }}
                autoComplete="off"
                sx={{
                  m: 1,
                  minWidth: 100,
                  top: "42.8rem",
                  position: "absolute",
                }}
              />

              <div className="square-checkout-quantity-atf">
                <div className="count-display-atf">
                  {isSuggestItem
                    ? itemQuantitiesSuggest[currentShoppingIndex]
                    : itemQuantities[currentShoppingIndex]}
                </div>
                <Button
                  variant="contained"
                  color="inherit"
                  className="decrement-button-atf"
                  onClick={() => decrementQuantity(currentShoppingIndex)}
                  sx={{ fontSize: "25px", width: "10px", height: "40px" }}>
                  -
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  className="increment-button-atf"
                  onClick={() => incrementQuantity(currentShoppingIndex)}
                  sx={{ fontSize: "20px", width: "10px", height: "40px" }}>
                  +
                </Button>
                <div className="checkout-quantity-text-atf">Quantity</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "700px",
                  justifyContent: "center",
                  gap: "50px",
                  marginTop: "743px",
                }}>
                <div
                  className="SearchItemCancelBtn1"
                  onClick={() => {
                    closeCheckoutModal();
                    handleCanceledAdd();
                  }}>
                  <h2 className="SearchItemCancelText">Cancel</h2>
                </div>

                <div
                  className={`SearchItemConfirmBtn1 ${
                    !itemDurations[selected[currentShoppingIndex]] ||
                    !itemContainers[selected[currentShoppingIndex]]
                      ? "disable"
                      : ""
                  }`}
                  onClick={
                    !itemDurations[selected[currentShoppingIndex]] ||
                    !itemContainers[selected[currentShoppingIndex]]
                      ? null // Disable onClick function if conditions are not met
                      : confirmShopping
                  }>
                  <h2 className="SearchItemConfirmText">Confirm</h2>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Tungtung copied this part from Natty: modified 28 November 2023 */}
        <Modal open={isAddedNewItemOpen} onClose={handleCloseAddedNewItem}>
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
              Item has been added to the fridge
            </h2>
            <div
              className="SuccessBtn"
              onClick={() => setIsAddedNewItemOpen(false)}>
              <h2 className="ConfirmText">Confirm</h2>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
