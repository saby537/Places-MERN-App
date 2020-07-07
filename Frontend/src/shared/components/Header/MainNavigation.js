import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import BackDrop from "../UIElements/BackDrop";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [DrawerIsOpen, SetDrawerOpen] = useState(false);
  const OpenDrawer = () => {
    SetDrawerOpen(true);
  };
  const CloseDrawer = () => {
    SetDrawerOpen(false);
  };

  return (
    <React.Fragment>
      {DrawerIsOpen && <BackDrop onClick={CloseDrawer} />}
      <SideDrawer show={DrawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      )
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={OpenDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Travel Diary</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
