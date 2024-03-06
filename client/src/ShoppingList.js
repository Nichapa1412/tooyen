// Natty modified at 9 December 2023 : I updated the code as the refactored code. 

import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import "./css/ShoppingList.css";
import "./css/AddToList.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TextField from "@mui/material/TextField";
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

export default function ShoppingList() {
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [SelectedDate, SetSelectedDate] = useState(null);
  
  //Description : This funciton is used for only when edit-icon is clicked, then delete-icon appears
  const [isEditIconClicked, setIsEditIconClicked] = useState(false);
  const [isDeleteIconVisible, setIsDeleteIconVisible] = useState(false);
  const scrollableContainer = document.querySelector(".scrollable-container");
  const specificPosition = 200;
  const [specificItemName, setSpecificItemName] = useState("");

  if (scrollableContainer) {
    scrollableContainer.scrollTop = specificPosition;
  }

  const fetchShoppingListData = () => {
    fetch(`http://localhost:5000/shoplist/itemInList`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cartItems && Array.isArray(data.cartItems)) {
          setShoppingList(data.cartItems);

          const listQuantity = data.cartItems.map((item) => item.Qty);
          setQuantity(listQuantity);
        } else {
          console.error("Invalid shopping list data:", data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching shopping list data: " + error);
        setIsLoading(false);
      });
  };

  const cancelItem = (itemID) => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };

    fetch(
      `http://localhost:5000/shoplist/canceledItem/${itemID}`,
      requestOptions
    )
      .then((response) => {
        if (response.status === 200) {
          console.log("Item canceled from shopping list successfully");
          // Refetch the updated shopping list data after a successful cancellation
          fetchShoppingListData();
        } else if (response.status === 404) {
          console.log(`Item not found in shopping list`);
        } else {
          console.error("Error canceling item");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const removeItems = () => {
    const requestOp = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`http://localhost:5000/shoplist/removedItems`, requestOp)
      .then((response) => {
        if (response.status === 200) {
          console.log("Removing all items successfully");
          fetchShoppingListData();
        } else {
          console.error("Error removing all items");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const done = () => {
    const requestOp = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`http://localhost:5000/shoplist/done`, requestOp)
      .then((response) => {
        if (response.status === 200) {
          console.log("Done");
          fetchShoppingListData();
        } else {
          console.error("Error done");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function getItemNameByItemID(itemID) {
    const selectedItem = shoppingList.find((item) => item.Item_ID === itemID);
    console.log(selectedItem);

    if (selectedItem) {
      return selectedItem.Item_Name;
    }
    return null;
  }

  const insertToFridge = async (itemDataArray) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/shoplist/insertToFridge",
        itemDataArray
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error inserting items to the fridge:", error.message);
    }
  };

  const confirmShopping = async () => {
    handleClosePopup();

    if (currentShoppingIndex === selected.length - 1) {
      const itemDataArray = selected.map((itemName, index) => {
        return {
          itemName: itemName,
          Loc_Num: itemContainers[selected[index]],
          Set_Dur: parseInt(itemDurations[selected[index]], 10),
          Quantity: itemQty[index],
        };
      });
      console.log("Item data array: ", itemDataArray);

      try {
        await insertToFridge(itemDataArray);
        setLastItemConfirmed(true);

        closeCheckoutModal();
        handleOpenAddedNotification(selectedItem);
        done();
        // Fetch shopping list data after items are inserted
        await fetchShoppingListData();
      } catch (error) {
        console.error("Error confirming shopping:", error.message);
      }
    } else {
      setCurrentShoppingIndex(currentShoppingIndex + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/fconf/allCartHistory"
        );
        const data = await response.json();

        const sortedData = data.sort(
          (a, b) => new Date(b.Finish_Date) - new Date(a.Finish_Date)
        );
        const mostRecentDate =
          sortedData.length > 0 ? sortedData[0].Finish_Date : null;

        SetSelectedDate(mostRecentDate);
      } catch (error) {
        console.error("Error fetching most recent cart date:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchShoppingListData();
  }, []);

  const listOptions = shoppingList.map((item) => item.Item_Name);
  const listInstore = shoppingList.map((item) => item.InCart);
  const listQuantity = shoppingList.map((item) => item.Qty);

  const [quantity, setQuantity] = useState([...listQuantity]);
  const [itemQty, setItemQty] = useState([...listQuantity]);

  useEffect(() => {
    setItemQty([...quantity]);
  }, [quantity]);

  const [selected, setSelected] = React.useState([]);
  const isAllSelected = selected.length === listOptions.length;
  const [remainingItems, setRemainingItems] = React.useState([]);

  function handleSelect(event, name) {
    if (event.target.checked) {
      setSelected([...selected, name]);

      setRemainingItems((prevItems) =>
        prevItems.filter((item) => item !== name)
      );
    } else {
      setSelected(selected.filter((item) => item !== name));
      setRemainingItems((prevItems) => [...prevItems, name]);
    }
  }

  function handleCloseEditIconClick() {
    setIsEditIconClicked(false);
    setIsDeleteIconVisible(false);
  }

  function handleSelectAll() {
    if (isAllSelected) {
      setSelected([]);
      setRemainingItems([...listOptions]);
    } else {
      setSelected([...listOptions]);

      setRemainingItems([]);
    }
  }

  function handleEditIconClick() {
    setIsEditIconClicked(!isEditIconClicked);
    setIsDeleteIconVisible(!isDeleteIconVisible);
  }

  const handleQuantityChange = (itemID, newQuantity) => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemID: itemID,
        newQuantity: newQuantity,
      }),
    };

    fetch(`http://localhost:5000/shoplist/updateQty`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        console.log("API CALL: ");
      })
      .catch((error) => {
        console.error("Error updating quantity: " + error);
      });
  };

  //Description : this is used for deleting item from shopping list - popup
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemID, setSelectedItemID] = useState(null);

  const handleOpenPopup = (itemID) => {
    setSelectedItemID(itemID);
    const itemName = getItemNameByItemID(itemID);
    setSelectedItem(itemName);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
    setPopupOpen(false);
  };

  //Description : this is used for deleting all item from shopping list - popup
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);

  const handleOpenSecondModal = () => {
    setSecondModalOpen(true);
  };

  const handleCloseSecondModal = () => {
    setSecondModalOpen(false);
  };

  //Description : this is used for showing the deleted item
  const [isDeletedNotificationOpen, setIsDeletedNotificationOpen] =
    useState(false);

  const handleOpenDeletedNotification = () => {
    setIsDeletedNotificationOpen(true);
  };

  const handleCloseDeletedNotification = () => {
    setIsDeletedNotificationOpen(false);
  };

  const handleInputChange = (event) => {
    setSpecificItemName(event.target.value);
    console.log("input: ", specificItemName);
  };

  //Description : this is used for comfirmation the chekout item
  const [isConfirmedCheckoutItem, setIsConfirmedCheckoutItem] = useState(false);

  const handleOpenConfirmedCheckoutItem = () => {
    setIsConfirmedCheckoutItem(true);
    setSelectedForCheckout(selected);
  };

  const handleCloseConfirmedCheckoutItem = () => {
    setIsConfirmedCheckoutItem(false);
  };

  //Description : this is used for select the checkout item
  const [selectedForCheckout, setSelectedForCheckout] = useState([]);

  function handleSelect(event, name) {
    setSelected([...selected, name]);
  }

  //Description : this is used for unselect the checkout item for each time
  const [unselectedForCheckout, setUnselectedForCheckout] = useState([]);

  function handleUnselect(event, name) {
    setSelected(selected.filter((item) => item !== name));
    setUnselectedForCheckout([...unselectedForCheckout, name]);
  }

  //Description : this is used for the remaining item out of selected item
  const getRemainingItems = () => {
    return listOptions.filter((item) => !selected.includes(item));
  };

  //Description : this is used fir checkout the item
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [currentShoppingIndex, setCurrentShoppingIndex] = useState(0);

  const openCheckoutModal = () => {
    if (selected.length > 0) {
      setCheckoutModalOpen(true);
      setCurrentShoppingIndex(0);
    }
  };

  const closeCheckoutModal = () => {
    setCheckoutModalOpen(false);
    setCurrentShoppingIndex(0);
  };

  const [lastItemConfirmed, setLastItemConfirmed] = useState(false);

  //Description : this is used for handle the selecting a container for an item
  const [itemContainers, setItemContainers] = useState({});

  const handleSelectContainer = (itemName, containerNumber) => {
    setItemContainers({ ...itemContainers, [itemName]: containerNumber });
  };

  //Description : this is used for the duration part
  const [itemDurations, setItemDurations] = useState({});

  const updateDuration = (itemName, duration) => {
    setItemDurations({ ...itemDurations, [itemName]: duration });
  };

  //Description : this is used for showing the succesfully checkout item
  const [isAddedNotificationOpen, setIsAddedNotificationOpen] = useState(false);

  const handleOpenAddedNotification = () => {
    setIsAddedNotificationOpen(true);
  };

  const handleCloseAddedNotification = () => {
    setIsAddedNotificationOpen(false);
  };

  const incrementQuantity = (index, itemID) => {
    const updatedQuantity = [...quantity];
    updatedQuantity[index] += 1;
    setQuantity(updatedQuantity);
    handleQuantityChange(itemID, updatedQuantity[index]);
  };

  const decrementQuantity = (index, itemID) => {
    const updatedQuantity = [...quantity];
    if (updatedQuantity[index] > 1) {
      updatedQuantity[index] -= 1;
      setQuantity(updatedQuantity);
      handleQuantityChange(itemID, updatedQuantity[index]);
    }
  };

  return (
    <div className="pageStyle-sl">
      <div className="containerStyle-sl">
        <div className="square-background-sl"></div>
        <div className="square-navigation-bar-sl"></div>

        <Link to="/CartHistory">
          <Button variant="contained" className="Last-shopping-date-sl">
            Last shopping: {formatDate(SelectedDate)}
          </Button>
        </Link>

        <div>
          <Routes>
            <Route path="/AddToList" element={<AddIcon />} />
          </Routes>
        </div>

        <div className="Container-sl">
          <SearchIcon
            className="SearchIcon-sl"
            style={{
              maxWidth: "50px",
              maxHeight: "50px",
              minWidth: "50px",
              minHeight: "50px",
              color: "black",
            }}
          />
          <input
            placeholder="Search Items In Shopping List"
            className="SearchInput-sl"
            spellCheck="true"
            value={specificItemName}
            onChange={handleInputChange}
          />
        </div>

        <div className="Header-sl">Shopping List</div>
        <img
          className="Shopping-cart-sl"
          src="../ShoppingList_Asset/Shoppingcart.png"
        />

        <Fab
          color={isEditIconClicked ? "error" : "warning"}
          aria-label="edit"
          className="edit-icon-sl"
          sx={{ width: "75px", height: "75px" }}
          onClick={handleEditIconClick}
        >
          <EditIcon fontSize="large" style={{ color: "white" }} />
        </Fab>

        <Button
          className="empty-list"
          variant="outlined"
          color="error"
          sx={{
            width: "200px",
            height: "50px",
            fontSize: "16px",
            display: isDeleteIconVisible ? "visible" : "none",
          }}
          onClick={handleOpenSecondModal}
        >
          EMPTY ALL ITEMS
        </Button>

        <div>
          {shoppingList.length > 0 && specificItemName === "" && (
            <FormControlLabel
              control={<Checkbox className="all-checkbox-sl" />}
              name="all"
              checked={selected.length === listOptions.length}
              onChange={handleSelectAll}
              label={<h1 className="Item-found-sl">Item In Shopping List</h1>}
            />
          )}
        </div>

        <div className="scrollable-container-sl">
          {shoppingList.length > 0 ? (
            shoppingList.map((item, index) => (
              <div
                className={`square-list-sl`}
                id={
                  item.Item_Name.toLowerCase().startsWith(
                    specificItemName.toLowerCase()
                  ) || specificItemName === ""
                    ? "show"
                    : "hide"
                }
                key={item.Item_Name}
              >
                <FormControlLabel
                  control={<Checkbox className="checkbox-sl" />}
                  name={item.Item_Name}
                  checked={selected.includes(item.Item_Name)}
                  onChange={(event) => {
                    if (selected.includes(item.Item_Name)) {
                      handleUnselect(event, item.Item_Name);
                    } else {
                      handleSelect(event, item.Item_Name);
                    }
                  }}
                  label={<span className="List-text-sl">{item.Item_Name}</span>}
                />

                <img
                  className="List-pic-sl"
                  src={`../img/${item.Item_Name.replace(
                    /\s/g,
                    "_"
                  ).toLowerCase()}.png`}
                  alt={`Image of ${item.Item_Name}`}
                  style={{
                    width: "25%",
                    height: "60%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src = "../img/default.png";
                  }}
                />

                <div className="In-store-text-sl">
                  In store: {listInstore[index]} pcs.
                </div>

                <div className="square-quantity-sl">
                  <div className="count-display-sl">{quantity[index]}</div>

                  <Button
                    variant="contained"
                    color="inherit"
                    className="decrement-button-sl"
                    onClick={() => decrementQuantity(index, item.Item_ID)}
                    sx={{ fontSize: "25px", width: "10px", height: "40px" }}
                  >
                    -
                  </Button>

                  <Button
                    variant="contained"
                    color="inherit"
                    className="increment-button-sl"
                    onClick={() => incrementQuantity(index, item.Item_ID)}
                    sx={{ fontSize: "20px", width: "10px", height: "40px" }}
                  >
                    +
                  </Button>
                </div>

                <IconButton
                  aria-label="delete"
                  className="delete-icon-sl"
                  sx={{
                    width: "75px",
                    height: "75px",
                    display: isDeleteIconVisible ? "block" : "none",
                  }}
                  onClick={() => {
                    handleOpenPopup(item.Item_ID);
                  }}
                >
                  <DeleteIcon fontSize="large" style={{ color: "#b22a00" }} />
                </IconButton>
              </div>
            ))
          ) : (
            <h1 className="no-item-text-sl" style={{ color: "grey" }}></h1>
          )}
        </div>

        {shoppingList.length === 0 && (
          <>
            <div
              className="circle-no-item-found-add"
              style={{ marginTop: "-45px" }}
            >
              <img
                className="no-item-found-pic"
                src="../ShoppingList_Asset/cart-empty.png"
                style={{
                  objectFit: "contain",
                }}
                alt="No item found"
              />
              <h1
                className="no-suggested-item-add"
                style={{
                  color: "black",
                  marginTop: "-40px",
                  left: "228px",
                }}
              >
                Your list is empty. Let’s try adding something!
              </h1>
            </div>
          </>
        )}

        {shoppingList.length > 0 &&
          !shoppingList.some((item) =>
            item.Item_Name.toLowerCase().startsWith(
              specificItemName.toLowerCase()
            )
          ) && (
            <>
              <div
                className="circle-no-item-found-add"
                style={{ marginTop: "-45px" }}
              >
                <img
                  className="no-item-found-pic"
                  src="../ShoppingList_Asset/no-item-found3.jpg"
                  style={{
                    objectFit: "contain",
                  }}
                  alt="No item found"
                />
                <h1
                  className="no-suggested-item-add"
                  style={{
                    color: "black",
                    marginTop: "-40px",
                    paddingLeft: "75px",
                  }}
                >
                  No item found in the shopping list
                </h1>
              </div>
            </>
          )}

        {listOptions.length === 0 ? (
          <Link
            to="/AddToList"
            style={{ textDecoration: "none", color: "black" }}
          >
            <h1 className="add-item-full-sl">GO TO ADD SHOPPING LIST</h1>
          </Link>
        ) : null}

        {listOptions.length > 0 ? (
          <div>
            <Link
              to="/AddToList"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h1 className="add-item-sl">GO TO ADD SHOPPING LIST</h1>
            </Link>

            {selected.length > 0 ? (
              <h1
                className="check-item-sl"
                onClick={handleOpenConfirmedCheckoutItem}
              >
                CHECK OUT THE ITEMS
              </h1>
            ) : (
              <h1 className="no-item-check-item-sl" style={{ color: "grey" }}>
                CHECK OUT THE ITEMS
              </h1>
            )}
          </div>
        ) : null}

        <Modal
          open={isPopupOpen}
          onClose={handleClosePopup}
          aria-labelledby="popup-title"
          aria-describedby="popup-description"
        >
          <div className="popup-content-sl">
            <h1 className="popup-title-sl">Delete from shopping list</h1>
            {selectedItem && (
              <p className="popup-description-sl">{selectedItem}</p>
            )}

            <img
              className="popup-pic-sl"
              src={`../img/${
                selectedItem
                  ? selectedItem.replace(/\s/g, "_").toLowerCase()
                  : "default"
              }.png`}
              style={{
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.src = "../img/default.png";
              }}
            />

            <div className="CancelBtn-sl" onClick={handleClosePopup}>
              <h2 className="CancelText-sl">Cancel</h2>
            </div>

            <div
              className="TakeOutBtn-sl"
              onClick={() => {
                cancelItem(selectedItemID);
                handleOpenDeletedNotification();
                handleClosePopup();
              }}
            >
              <h2 className="ConfirmText-sl">Confirm</h2>
            </div>
          </div>
        </Modal>

        <Modal
          open={isSecondModalOpen}
          onClose={handleCloseSecondModal}
          aria-labelledby="second-popup-title"
          aria-describedby="second-popup-description"
        >
          <div className="second-popup-content-sl">
            <h1 className="second-popup-title-sl">
              Delete All Items from Shopping List
            </h1>

            <div className="scrollable-container-popup-sl">
              {listOptions.map((item, index) => (
                <p key={index} className="second-popup-description-sl">
                  {item}
                </p>
              ))}
            </div>

            <div
              className="CancelBtn-sl"
              onClick={() => {
                handleCloseSecondModal();
              }}
            >
              <h2 className="CancelText-sl">Cancel</h2>
            </div>

            <div
              className="TakeOutBtn-sl"
              onClick={() => {
                removeItems();
                handleOpenDeletedNotification();
                handleCloseSecondModal();
              }}
            >
              <h2 className="ConfirmText-sl">Confirm</h2>
            </div>
          </div>
        </Modal>

        <Modal
          open={isDeletedNotificationOpen}
          onClose={handleCloseDeletedNotification}
          aria-labelledby="second-popup-title"
          aria-describedby="second-popup-description"
        >
          <div className="complete-deleted-popup-content-sl">
            <CheckCircleOutlineIcon
              className="sucessfully-deleted-icon-sl"
              sx={{
                fontSize: "25px",
                width: "100px",
                height: "100px",
                color: "white",
              }}
            />

            <h2 className="complete-deleted-popup-title-sl">
              Successfully deleted items
            </h2>

            <Button
              className="done-deleted-button-sl"
              variant="contained"
              color="info"
              onClick={() => {
                handleCloseDeletedNotification();
                handleCloseEditIconClick();
              }}
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
          open={isAddedNotificationOpen}
          onClose={handleCloseAddedNotification}
          aria-labelledby="succesfully-checkout-popup"
          aria-describedby="succesfully-checkout-popup"
        >
          <div className="complete-deleted-popup-content-sl">
            <CheckCircleOutlineIcon
              className="sucessfully-deleted-icon-sl"
              sx={{
                fontSize: "25px",
                width: "100px",
                height: "100px",
                color: "white",
              }}
            />
            <h2 className="complete-deleted-popup-title-sl">
              Successfully check out items
            </h2>
            <Button
              className="done-deleted-button-sl"
              variant="contained"
              color="info"
              onClick={handleCloseAddedNotification}
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
          open={isConfirmedCheckoutItem}
          onClose={handleCloseConfirmedCheckoutItem}
          aria-labelledby="confirmed-checkot-popup-title"
          aria-describedby="confirmed-checkot-popup-description"
        >
          <div className="confirmed-checkout-popup-content-sl">
            <div>
              <div className="checkout-title-sl" style={{ color: "error" }}>
                Check out Confirmation
              </div>

              <div className="square-selected-checkout-sl"></div>
              <div
                className="selected-checkout-text-sl"
                style={{ color: "#FFFFFF" }}
              >
                CHECK OUT
              </div>

              <div className="scrollable-selected-checkout-sl">
                {selectedForCheckout.length === 0 ? (
                  <div
                    className="no-item-deleted-sl"
                    style={{ color: "primary" }}
                  >
                    no item
                  </div>
                ) : (
                  <div>
                    {" "}
                    {selectedForCheckout.map((item, index) => (
                      <div
                        key={index}
                        className="selected-checkout-list-sl"
                        style={{ color: "#628256" }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="square-unselected-checkout-sl"></div>
              <div
                className="unselected-checkout-text-sl"
                style={{ color: "#FFFFFF" }}
              >
                DELETE
              </div>
              <div className="scrollable-unselected-checkout-sl">
                {getRemainingItems().length === 0 ? (
                  <div
                    className="no-item-deleted-sl"
                    style={{ color: "primary" }}
                  >
                    no item
                  </div>
                ) : (
                  <div>
                    {getRemainingItems().map((item, index) => (
                      <div
                        key={index}
                        className="unselected-checkout-list-sl"
                        style={{ color: "#9D2323" }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Button
                className="confirmed-checkout-cancel-button-sl"
                variant="contained"
                color="error"
                onClick={handleCloseConfirmedCheckoutItem}
              >
                CANCEL
              </Button>
              <Button
                className="confirmed-checkout-confirm-button-sl"
                variant="contained"
                onClick={() => {
                  openCheckoutModal();
                  handleCloseConfirmedCheckoutItem();
                }}
                style={{ backgroundColor: "#24bd2a" }}
              >
                CONFIRM
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={isCheckoutModalOpen}
          onClose={closeCheckoutModal}
          aria-labelledby="checkout-modal-title"
          aria-describedby="checkout-modal-description"
        >
          <div className="checkout-modal-content-sl">
            <h1 className="checkout-popup-title-sl">Check out Items</h1>
            {currentShoppingIndex < selected.length ? (
              <div>
                <IconButton
                  className="checkout-back-button-sl"
                  onClick={() =>
                    setCurrentShoppingIndex(currentShoppingIndex - 1)
                  }
                  disabled={currentShoppingIndex === 0}
                >
                  <ArrowBackIcon />
                </IconButton>

                <IconButton
                  className="checkout-forth-button-sl"
                  onClick={() =>
                    setCurrentShoppingIndex(currentShoppingIndex + 1)
                  }
                  disabled={
                    currentShoppingIndex === selected.length - 1 ||
                    !itemDurations[selected[currentShoppingIndex]] ||
                    !itemContainers[selected[currentShoppingIndex]]
                  }
                >
                  <ArrowForwardIosIcon />
                </IconButton>

                <p className="checkout-description-item-sl">
                  {selected[currentShoppingIndex]}
                </p>
                <div className="checkout-location-text-sl">Location</div>
                <div>
                  <img
                    className="fridgeBody-sl"
                    src={`../Fridge_Asset/FridgeBody.png`}
                  />

                  <div className="ContainerFridge">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((containerNumber) => (
                      <div
                        key={containerNumber}
                        className={`Container${containerNumber}-sl hover-effect-sl ${
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
                        }}
                      >
                        <span className="container-number">
                          {containerNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="checkout-duration-text-sl">Duration Time :</div>
                <div className="checkout-duration-days-sl">Days</div>
                <TextField
                  className="checkout-duration-sl"
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
                  sx={{ m: 1, minWidth: 100 }}
                />

                <div className="square-checkout-quantity-sl">
                  <div className="count-display-sl">
                    {itemQty[currentShoppingIndex]}
                  </div>
                  <Button
                    variant="contained"
                    color="inherit"
                    className="decrement-button-sl"
                    onClick={() => decrementQuantity(currentShoppingIndex)}
                    sx={{ fontSize: "25px", width: "10px", height: "40px" }}
                  >
                    -
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    className="increment-button-sl"
                    onClick={() => incrementQuantity(currentShoppingIndex)}
                    sx={{ fontSize: "20px", width: "10px", height: "40px" }}
                  >
                    +
                  </Button>
                  <div className="checkout-quantity-text-sl">Quantity</div>
                </div>

                <div
                  className="CancelBtn-checkout-sl"
                  onClick={closeCheckoutModal}
                >
                  <h2 className="CancelText-sl">Cancel</h2>
                </div>

                <div
                  className="TakeOutBtn-checkout-sl"
                  onClick={closeCheckoutModal}
                >
                  <h2 className="ConfirmText-sl">Confirm</h2>
                </div>
                <div
                  className={`TakeOutBtn-checkout-sl ${
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
                  }
                >
                  <h2 className="ConfirmText-sl">
                    {currentShoppingIndex < selected.length - 1
                      ? "Next"
                      : "Confirm"}
                  </h2>
                </div>
              </div>
            ) : (
              <div>No items selected for shopping.</div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
