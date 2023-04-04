import React from "react";
import Box from "@mui/material/Box";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Landing from "./components/Landing";
import CourseHP from "./components/CourseHP";
import Login from "./components/Login";
import Catalog from "./components/Catalog";
import Navigation from "./components/Navbar";
import ReadFile from "./components/Files";
import FileDirectory from "./components/FileDirectory";

function App() {
  return (
    <Router>
      <Navigation />
      <Box sx={{ display: "flex" }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/courses">
            <Route index={true} element={<Catalog />} />
            <Route path="/courses/:coursecode" element={<CourseHP />} />
          </Route>
          <Route path="/files">
            <Route index={true} element={<FileDirectory />} />
            <Route path="/files/:fileid" element={<ReadFile />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
