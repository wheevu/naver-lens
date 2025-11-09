import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageA from "./pages/PageA";



const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageA />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};


export default App;