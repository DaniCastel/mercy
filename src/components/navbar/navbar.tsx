import React from "react";
import logo from "./logo.svg";
import "./Navbar.scss";

function Navbar() {
  return (
    <div className="Navbar">
      <header className="Navbar-header">
        <img src={logo} className="Navbar-logo" alt="logo" />
        <p>
          Edit <code>src/Navbar.tsx</code> and save to reload.
        </p>
        <a
          className="Navbar-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Navbar;
