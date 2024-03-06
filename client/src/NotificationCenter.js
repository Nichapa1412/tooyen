// Description: This is NotificationCenter part. This code will display the expired item also notify user to take it out from fridge.
import React, { useState, useEffect } from "react";
import "./css/NotificationCenter.css";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Create the "day month year" format
  return `${day} ${month} ${year}`;
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/home/fetchItemExpires"
        );
        const data = await response.json();

        if (data.items) {
          setNotifications(data.items);
          console.log("Fetched data:", data.items);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="NotiBg" alt="Notification Center Background">
      <div className="NotiOrangeBox">
        <Link to="/Homepage" style={{ textDecoration: "none" }}>
          <div className="NotiBackBtn">
            <IconButton>
              <ArrowBack
                style={{
                  maxWidth: "50px",
                  maxHeight: "50px",
                  minWidth: "50px",
                  minHeight: "50px",
                  color: "White",
                }}
              />
            </IconButton>
          </div>
        </Link>
        <h1 className="NotificationCenterText">Notification Center</h1>
        <img
          className="BellImage"
          src="../Homepage_Asset/Bell.png"
          alt="Bell"
        />
      </div>
      <div className="AllNoti" style={{ height: "950px", overflow: "scroll" }}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div className="NotificationBox" key={notification.Item_ID}>
              <img
                className="NotiImage"
                src={`../img/${notification.Item_Name}.png`}
                alt={notification.Item_Name}
                style={{
                  objectFit: "contain",
                }}
                onError={(e) => {
                  e.target.src = "../img/default.png";
                }}
              />
              <div className="NotiDetailWrapper">
                <h3 className="NotificationName">
                  {notification.Item_Name} is expired
                </h3>
                <div className="NotiDetail">
                  Purchase Date: {formatDate(notification.Add_Date)}
                </div>
                <div className="NotiDetail">
                  Expire Date:{" "}
                  {notification.Ex_Date
                    ? formatDate(notification.Ex_Date)
                    : "-"}
                </div>
                <div className="NotiDetail">
                  Location: {notification.Loc_Num}
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 className="NoNoti">No notifications available</h2>
        )}
      </div>
    </div>
  );
}
