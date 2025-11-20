import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import PageA from "./pages/PageA";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/store/:productId" element={<ProductPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
