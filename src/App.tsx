import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Homepage";
import ReceptionPage from "./pages/ReceptionPage";

function App() {
  return (
    <div className="w-screen max-w-[380px] mx-auto relative">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reception" element={<ReceptionPage />} />
      </Routes>
    </div>
  );
}

export default App;
