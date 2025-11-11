import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageA from "./pages/PageA";
import Home from "./pages/Home";

const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageA />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
