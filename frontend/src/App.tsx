import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import TourDetails from "./pages/TourDetails";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tour/:slug" element={<TourDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
