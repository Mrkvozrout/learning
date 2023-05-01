import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token";
import {opend } from "../../../declarations/opend";
import Button from "./Button";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";
import { Principal } from "@dfinity/principal";

function Item(props) {

  const host = "http://localhost:4943/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai"

  const [nftName, setNftName] = useState();
  const [nftOwner, setNftOwner] = useState();
  const [nftImage, setNftImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [offered, setOffered] = useState(false);
  const [priceLabel, setPriceLabel] = useState();

  let nftActor;
  let price;

  let nftId = props.id;
  let agent = new HttpAgent({host: host});
  agent.fetchRootKey(); //TODO must remove before deploying to live (trust the endpoint in other then live, prone to MITM attacks)

  async function loadNft() {
    nftActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: nftId
    });

    setNftName(await nftActor.getName());
    
    let nftData = await nftActor.getData();
    let nftImageUrl = URL.createObjectURL(
      new Blob([new Uint8Array(nftData).buffer], {type: "image/png"})
      );
    setNftImage(nftImageUrl);
    
    let nftOwnerPrincipal = await nftActor.getOwner();
    setNftOwner(nftOwnerPrincipal.toText());

    if (props.role === "private") {
      setButton(<Button text={"Sell"} handleClick={handleSell} />);
      
      setOffered(await opend.isOffered(nftId));
    }
    else if (props.role === "offering") {
      let originalOwner = await opend.getOriginalOwner(props.id);
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button text={"Buy"} handleClick={handleBuy} />);
      }

      const price = await opend.getNftPrice(props.id);
      setPriceLabel(<PriceLabel price={price.toString()} />);
    }
  }

  useEffect(() => {
    loadNft();
  }, [])

  function handleSell() {
    setPriceInput(
      <input
        placeholder="Price in MRKV"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => {price = e.target.value}}
      />);
    setButton(<Button text={"Confirm sell"} handleClick={handleConfirmSell} />);
  }

  async function handleConfirmSell() {
    setLoaderHidden(false);
    let offerResult = await opend.offerNft(nftId, parseInt(price));
    console.log("Offer result: " + offerResult);
    if (offerResult === "Success") {
      let opendId = await opend.getCanisterId();
      let transferResult = await nftActor.transferOwnership(opendId);
      console.log("Transfer result: " + transferResult);
      if (transferResult === "Success") {
        setLoaderHidden(true);
        setOffered(true)
      }
    }
  }

  async function handleBuy() {
    setLoaderHidden(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("wflfh-4yaaa-aaaaa-aaata-cai")
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const nftPrice = await opend.getNftPrice(props.id);
    const result = await tokenActor.transfer(sellerId, nftPrice);
    console.log("Payment transfer: " + result);

    if (result) {
      var resultComplete = await opend.completePurchase(props.id, sellerId, CURRENT_USER_ID);
      console.log("Purchase result: " + resultComplete);
      setLoaderHidden(true);
    }
  }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={nftImage}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {nftName} <span className="purple-text">{offered && "Listed"}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {offered ? "OpenD" : nftOwner}
          </p>
          {!offered && priceInput}
          {!offered && button}
        </div>
      </div>
    </div>
  );
}

export default Item;
