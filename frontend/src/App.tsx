import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import "./App.css";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Overview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
