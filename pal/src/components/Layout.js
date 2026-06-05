import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Layout.css";

function Layout({ children }) {
  const location = useLocation();

  // Don't show navbar on login/signup pages
  const hideNavbarRoutes = ["/login", "/signup"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="layout-container">
      {showNavbar && <Navbar />}
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
