import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./css/SearchBar.css";

export default function SearchBar() {
  return (
    <div className="Container">
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
      <input placeholder="Search Items" color="00000" className="SearchInput" />
    </div>
  );
}
