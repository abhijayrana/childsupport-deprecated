import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import Button from "@mui/material/Button";

import { Box } from "@mui/material";

export default function Navigation() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "transparent" }}>
        <Toolbar
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="h6"
            style={{ color: "black", fontSize: "33px" }}
            sx={{ mr: 10 }}
            href="/"
          >
            Child Support{" "}
          </Button>
          <Button
            variant="h6"
            style={{ color: "black", fontSize: "18px" }}
            href="/courses"
          >
            Catalog
          </Button>
          <Button
            variant="h6"
            style={{ color: "black", fontSize: "18px" }}
            href="/login"
          >
            Login
          </Button>
          <Button
            variant="h6"
            style={{ color: "black", fontSize: "18px" }}
            href="/files"
          >
            Files
          </Button>
          <Button
            variant="h6"
            style={{ color: "black", fontSize: "18px" }}
            href="/uploader"
          >
            Upload Files
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
