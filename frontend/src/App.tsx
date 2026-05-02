import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import ExperienceDetails from "./pages/ExperienceDetails";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />} errorElement={<ErrorPage />}>
          <Route path="/" element={<Overview />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/experience/:slug" element={<ExperienceDetails />} />
          <Route path="/me" element={<AccountPage />} />
          <Route path="/my-experiences" element={<Overview />} />
          <Route path="*" element={<ErrorPage message="Page not found." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
