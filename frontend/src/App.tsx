import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import ExperienceDetails from "./pages/ExperienceDetails";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";
import ErrorPage from "./pages/ErrorPage";
import RequireRole from "./components/RequireRole";
import DashboardHome from "./pages/admin/DashboardHome";
import ExperiencesAdmin from "./pages/admin/ExperiencesAdmin";
import GuidesAdmin from "./pages/admin/GuidesAdmin";
import GuideDetail from "./pages/admin/GuideDetail";
import UsersAdmin from "./pages/admin/UsersAdmin";
import BookingsAdmin from "./pages/admin/BookingsAdmin";

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
        </Route>

        <Route element={<RequireRole roles={["admin", "lead-guide"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardHome />} />
            <Route path="/admin/experiences" element={<ExperiencesAdmin />} />
            <Route path="/admin/guides" element={<GuidesAdmin />} />
            <Route path="/admin/guides/:id" element={<GuideDetail />} />
            <Route path="/admin/users" element={<UsersAdmin />} />
            <Route path="/admin/bookings" element={<BookingsAdmin />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage message="Page not found." />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
