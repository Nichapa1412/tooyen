import React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RecipeIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import FridgeIcon from "@mui/icons-material/Kitchen";
import SettingIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

const line = {
  height: "11px",
  left: "19px",
  position: "fixed",
  top: "1250px",
  width: "922px",
};

export function Navbar() {
  return (
    <div>
      <img src="../Navbar/line-1.png" alt={`Nav`} style={line} />
      <Stack spacing={10} direction="row" sx={{ height: "100px" }}>
        <Link to="/ShoppingList">
          <IconButton>
            <ShoppingCartIcon
              style={{
                maxWidth: "80px",
                maxHeight: "80px",
                minWidth: "80px",
                minHeight: "80px",
                color: "Black",
              }}
            />
          </IconButton>
        </Link>
        <Link to="/Recipe">
          <IconButton>
            <RecipeIcon
              style={{
                maxWidth: "80px",
                maxHeight: "80px",
                minWidth: "80px",
                minHeight: "80px",
                color: "Black",
              }}
            />
          </IconButton>
        </Link>
        <Link to="/Homepage">
          <IconButton>
            <HomeIcon
              style={{
                maxWidth: "80px",
                maxHeight: "80px",
                minWidth: "80px",
                minHeight: "80px",
                color: "Black",
              }}
            />
          </IconButton>
        </Link>
        <Link to="/SearchItem">
          <IconButton>
            <FridgeIcon
              style={{
                maxWidth: "80px",
                maxHeight: "80px",
                minWidth: "80px",
                minHeight: "80px",
                color: "Black",
              }}
            />
          </IconButton>
        </Link>
        <Link to="/Settings">
          <IconButton>
            <SettingIcon
              style={{
                maxWidth: "80px",
                maxHeight: "80px",
                minWidth: "80px",
                minHeight: "80px",
                color: "Black",
              }}
            />
          </IconButton>
        </Link>
      </Stack>
    </div>
  );
}
