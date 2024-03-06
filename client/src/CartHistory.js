// Description: This Cart History will display all shopping list history and able to filter by date of shopping list
import React, { useState, useEffect } from "react";
import "./css/CartHistory.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";

const formatDate = (dateString) => {
  const datee = new Date(dateString);
  const day = datee.getDate();
  const month = datee.toLocaleString("default", { month: "short" });
  const year = datee.getFullYear();

  // Create the "day month year" format
  return `${day} ${month} ${year}`;
};

const formatDate2 = (dateString) => {
  const datee = new Date(dateString);
  const day = datee.getDate();
  const month = datee.toLocaleString("default", { month: "short" });
  const year = datee.getFullYear();
  const hours = datee.getHours().toString().padStart(2, "0");
  const minutes = datee.getMinutes().toString().padStart(2, "0");

  // Create the "day month year hours:minutes" format
  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const columns = [
  { id: "Name", label: "Name", minWidth: 170 },
  { id: "Quantity", label: "Quantity", minWidth: 100, align: "right" },
  {
    id: "Status",
    label: "Status",
    minWidth: 170,
    align: "right",
  },
];

//This is for table row color decoration by swapping each row with different color
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CartHistory() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownContainerActive, setDropdownContainerActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/fconf/allCartHistory"
        );
        const data = await response.json();

        const uniqueDates = [...new Set(data.map((item) => item.Finish_Date))];
        uniqueDates.sort((a, b) => new Date(b) - new Date(a));
        console.log("Date got:", uniqueDates);
        const firstShowDate = uniqueDates[0];

        if (selectedDate === null) {
          setSelectedDate(firstShowDate);
        }

        const filteredData = data.filter(
          (item) => item.Finish_Date === selectedDate
        );

        const formattedRows = filteredData.map((item) => ({
          Name: item.Item_Name,
          Quantity: item.Qty,
          Status: item.Status,
        }));

        setRows(formattedRows);
        setDate(uniqueDates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div className="CartHistoryBG">
      <Link to="/Settings" style={{ textDecoration: "none" }}>
        <div className="CartBackBtn">
          <IconButton>
            <ArrowBack
              style={{
                maxWidth: "50px",
                maxHeight: "50px",
                minWidth: "50px",
                minHeight: "50px",
                color: "black",
              }}
            />
          </IconButton>
        </div>
      </Link>
      <h1 className="CartHistoryText">Cart History</h1>
      <img
        src="../Homepage_Asset/clock.png"
        style={{
          height: "100px",
          width: "100px",
          marginTop: "65px",
          marginLeft: "460px",
        }}
        alt="Clock"
      />
      <div className="CartHistoryWhiteBG">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            className={`DropdownContainer ${
              dropdownContainerActive ? "active" : ""
            }`}
            style={{ display: "flex", flexDirection: "column" }}
            onClick={() => {
              setOpenDropdown(!openDropdown);
              setDropdownContainerActive(!dropdownContainerActive);
            }}>
            <div className="CartDateText">
              {selectedDate ? formatDate(selectedDate) : "Select Date"}
            </div>
            <div className="CartArrowBack">
              <ArrowBack
                style={{
                  maxWidth: "30px",
                  maxHeight: "30px",
                  minWidth: "30px",
                  minHeight: "30px",
                  color: "black",
                  transform: "rotate(270deg)",
                }}
              />
            </div>
          </div>
          <h2 className="CartNoDisplay">
            Cart: {selectedDate ? formatDate2(selectedDate) : "Select Date"}
          </h2>
        </div>

        {/* For open dropdown of date selection */}
        {openDropdown && (
          <div
            className="DropdownOpenContainer"
            style={{
              width: "250px",
              zIndex: 1,
              height: "300px",
              top: "100px",
              left: "60px",
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              overflowY: "scroll",
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
            }}>
            {date.map((date) => (
              <div className="DropdownOptionContainer" key={date}>
                <div
                  className="CartDateText1"
                  onClick={() => {
                    setSelectedDate(date);
                    setOpenDropdown(!openDropdown);
                    setDropdownContainerActive(false);
                  }}>
                  {formatDate(date)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table Display */}
        <div>
          <Paper
            sx={{
              width: "850px",
              borderRadius: "30px",
              marginLeft: "55px",
              top: "140px",
              zIndex: 0,
              position: "absolute",
              boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
            }}>
            <TableContainer sx={{ maxHeight: 850, borderRadius: "20px" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: "#ffe5a3",
                          fontFamily: "SF UI Display-Bold, Helvetica",
                          fontSize: "25px",
                          zIndex: 0,
                        }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    return (
                      <StyledTableRow
                        key={row.name}
                        role="checkbox"
                        tabIndex={-1}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                fontFamily: "SF UI Display-Bold, Helvetica",
                                fontSize: "20px",
                              }}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </div>
    </div>
  );
}
