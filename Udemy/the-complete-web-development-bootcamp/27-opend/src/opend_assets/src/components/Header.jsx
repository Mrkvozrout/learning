import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import homeImage from "../../assets/home-img.png";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import Minter from "./Minter";
import Gallery from "./Gallery";
import CURRENT_USER_ID from "../index";
import { opend } from "../../../declarations/opend";


function Header() {

  const [userGalery, setUserGalery] = useState();
  const [offeringGalery, setOfferingGalery] = useState();

  useEffect(() => {createUserGalery()}, [])

  async function createUserGalery() {
    const userNftIds = await opend.getOwnedNftIds(CURRENT_USER_ID);
    setUserGalery(<Gallery title="My NFTs" nftIds={userNftIds} role="private" />)

    const offeredNfts = await opend.getOfferedNfts();
    setOfferingGalery(<Gallery title={"Discover"} nftIds={offeredNfts} role="offering" />);
  }

  return (
    //cannot use <BrowserRouter forceRefresh={true}> because npm does not work and I need to access pages with canister URL with query ?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai
    <BrowserRouter>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collection">My NFTs</Link>
            </button>
          </div>
        </header>
      </div>
      <Switch>
        <Route exact path="/">
          <img className="bottom-space" src={homeImage} />
        </Route>
        <Route path="/discover">
          {offeringGalery}
        </Route>
        <Route path="/minter">
          <Minter />
        </Route>
        <Route path="/collection">
          {userGalery}
        </Route>
      </Switch>
      </BrowserRouter>
  );
}

export default Header;
