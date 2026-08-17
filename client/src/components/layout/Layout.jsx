import { Outlet } from "react-router-dom";

import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/Sidebar";

import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-layout">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Page content changes here */}
      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}