import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { PencilFill, BoxArrowRight } from "react-bootstrap-icons";
import code from "../assets/code.png";

export const NavBar = () => {
  const { logout, isAuthenticated } = useAuth0();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <img
          src={code}
          alt="Logo"
          width="30 "
          height="30"
          className="d-inline-block align-bottom"
        />
        <a className="navbar-brand ml-2" href="/">
          Code-snipps
        </a>
        {isAuthenticated ? (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <Nav className="ml-auto mt-2 ">
                <Link className="nav-link" to="/addNewMemory">
                  Create a Code-snipp
                  <PencilFill className="ml-2" />
                </Link>

                <Link className="nav-link " onClick={() => logout()}>
                  LogOut
                  <BoxArrowRight className="ml-2" />
                </Link>
              </Nav>
            </div>
          </>
        ) : (
          <span></span>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
