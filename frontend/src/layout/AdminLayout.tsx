import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/experiences", label: "Experiences" },
  { to: "/admin/guides", label: "Guides" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/", label: "Back To Homepage" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          onClick={() => setDrawerOpen((v) => !v)}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Toggle navigation"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <span className="text-sm font-semibold">Bookit Admin</span>
        <div className="w-9" />
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0`}
        >
          <div className="flex h-16 items-center border-b border-slate-200 px-6">
            <span className="text-lg font-semibold tracking-tight">
              Bookit Admin
            </span>
          </div>

          <nav className="px-3 py-4">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li
                  key={item.to}
                  className="last:border-t last:border-slate-200 last:pt-2 last:mt-2"
                >
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-slate-900 !text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 p-4">
            <div className="mb-3">
              <p className="truncate text-sm font-medium text-slate-900">
                {user?.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.role === "admin" ? "Administrator" : "Lead Guide"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Main */}
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
