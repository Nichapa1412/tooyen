// Description: This code is for settings. This code will allow user to customize their name also an email for receiving notification alert
// about expired food. Furthermore, this code include button to link to CartHistory.js for looking the shopping list history.

import React, { useState, useEffect } from "react";
import "./css/Settings.css";
import AccountIcon from "@mui/icons-material/AccountCircle";
import NotificationIcon from "@mui/icons-material/Sms";
import SettingsHistoryIcon from "@mui/icons-material/History";
import SettingsEditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";

export default function Settings() {
  const [openProfile, setOpenProfile] = useState(false);
  const [editProfileActive, setEditProfileActive] = useState(true);

  const [openEmail, setOpenEmail] = useState(false);
  const [editEmailActive, setEditEmailActive] = useState(true);

  const [username, setUsername] = useState("");
  const [showUsername, setShowUsername] = useState("");

  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/fconf/fetchUser");

      if (response.ok) {
        const data = await response.json();
        setUsername(data[0]?.UserName);
        setShowUsername(data[0]?.UserName);
        setEmail(data[0]?.UserEmail);
        setEmail2(data[0]?.UserEmail);

        console.log("API Fetched Username:", data[0]?.UserName);
        console.log("API Fetched Email:", data[0]?.UserEmail);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error while fetching user data", error);
    }
  };

  const handleCancel = () => {
    setUsername(showUsername);
    setEmail(email2);
  };

  const handleSave = async (inputValue, field) => {
    try {
      const response = await fetch(
        "http://localhost:5000/fconf/updateProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [field]: inputValue }),
        }
      );

      if (response.ok) {
        if (field === "Username") {
          setUsername(inputValue);
        } else if (field === "Email") {
          setEmail(inputValue);
          setEmail2(inputValue);
        }
        fetchUserData();
        setEditProfileActive(false);
        console.log(`${field} saved successfully!`);
      } else {
        console.error(`Failed to save ${field.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error while saving ${field.toLowerCase()}`, error);
    }
  };

  const ChangeProfileDisableTextField = () => {
    setEditProfileActive(!editProfileActive);
  };

  const ChangeEmailDisableTextField = () => {
    setEditEmailActive(!editEmailActive);
  };

  return (
    <div className="SettingsBG">
      <h1 className="SettingsText">Settings</h1>
      <img
        src="../Homepage_Asset/Settings.png"
        style={{
          height: "100px",
          width: "100px",
          marginTop: "65px",
          marginLeft: "350px",
          transform: "rotate(20deg)",
        }}></img>
      <div className="SettingsWhiteBG">
        <div
          className="SettingBox"
          onClick={() => {
            setOpenProfile(true);
            setEditProfileActive(true);
          }}>
          <AccountIcon
            style={{
              width: "70px",
              height: "70px",
              marginTop: "40px",
              marginLeft: "40px",
            }}
          />
          <div className="SettingDetail">
            <div className="SettingDetail1">{showUsername}</div>
            <div className="SettingDetail2">Edit Profile Name</div>
          </div>
        </div>

        <div
          className="SettingBox"
          onClick={() => {
            setOpenEmail(true);
            setEditEmailActive(true);
          }}>
          <NotificationIcon
            style={{
              width: "70px",
              height: "70px",
              marginTop: "40px",
              marginLeft: "40px",
            }}
          />
          <div className="SettingDetail">
            <div className="SettingDetail1">Notification</div>
            <div className="SettingDetail2">Setup Email to notify</div>
          </div>
        </div>
        <Link to="/CartHistory" style={{ textDecoration: "none" }}>
          <div className="SettingBox">
            <SettingsHistoryIcon
              style={{
                width: "70px",
                height: "70px",
                marginTop: "40px",
                marginLeft: "40px",
                color: "black",
              }}
            />
            <div className="SettingDetail">
              <div className="SettingDetail1">Cart History</div>
              <div className="SettingDetail2">Your Shopping History</div>
            </div>
          </div>
        </Link>
      </div>

      {openProfile && (
        <div open={openProfile} onClose={() => setOpenProfile(false)}>
          <div
            onClick={() => {
              setOpenProfile(false);
              setEditProfileActive(true);
            }}
            className="SettingOverlay">
            <div className="SettingProfileWhiteBox">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <h2 className="SettingProfileText">Profile</h2>
                  <img
                    src="../Homepage_Asset/Profile.png"
                    style={{
                      width: "90px",
                      height: "90px",
                      marginLeft: "20px",
                      marginTop: "60px",
                    }}
                  />
                  <div className="SettingEditBtn">
                    <IconButton onClick={ChangeProfileDisableTextField}>
                      <SettingsEditIcon
                        style={{
                          color: "black",
                          maxWidth: "65px",
                          maxHeight: "65px",
                          minWidth: "65px",
                          minHeight: "65px",
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
                <div className="SettingNameText">Username</div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    color="ddd"
                    className={`SettingInput ${
                      editProfileActive ? "active" : ""
                    }`}
                    style={{ paddingLeft: "50px", color: "#000000" }}
                    disabled={editProfileActive}
                  />
                </div>
                <div
                  className="SettingCancelBtn"
                  onClick={() => {
                    handleCancel();
                    setOpenProfile(false);
                  }}>
                  <h2 className="SettingCancelText">Cancel</h2>
                </div>
                <div
                  className={`SaveBtn ${editProfileActive ? "disable" : ""}`}
                  onClick={() => {
                    if (!editProfileActive) {
                      handleSave(username, "Username");
                      setOpenProfile(false);
                    }
                  }}>
                  <h2 className="SaveText">Save</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {openEmail && (
        <div open={openEmail} onClose={() => setOpenEmail(false)}>
          <div
            onClick={() => {
              setOpenEmail(false);
              setEditEmailActive(true);
            }}
            className="SettingOverlay">
            <div className="SettingEmailWhiteBox">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <h2 className="SettingEmailText">
                    Setup Email for Notification
                  </h2>
                  <img
                    src="../Homepage_Asset/Email.png"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginLeft: "50px",
                      marginTop: "90px",
                    }}
                  />
                  <div className="SettingEditBtn">
                    <IconButton onClick={ChangeEmailDisableTextField}>
                      <SettingsEditIcon
                        style={{
                          color: "black",
                          maxWidth: "65px",
                          maxHeight: "65px",
                          minWidth: "65px",
                          minHeight: "65px",
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
                <div className="SettingNameText">Email</div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <input
                    placeholder={email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    color="ddd"
                    className={`SettingInput ${
                      editEmailActive ? "active" : ""
                    }`}
                    style={{ paddingLeft: "50px", color: "#000000" }}
                    disabled={editEmailActive}
                  />
                </div>

                <div
                  className="SettingCancelBtn"
                  onClick={() => {
                    setOpenEmail(false);
                    handleCancel();
                  }}>
                  <h2 className="SettingCancelText">Cancel</h2>
                </div>
                <div
                  className={`SaveBtn ${editEmailActive ? "disable" : ""}`}
                  onClick={() => {
                    if (!editEmailActive) {
                      handleSave(email, "Email");
                      setOpenEmail(false);
                    }
                  }}>
                  <h2 className="SaveText">Save</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
