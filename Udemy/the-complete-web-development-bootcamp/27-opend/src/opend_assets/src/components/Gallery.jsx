import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Principal } from "@dfinity/principal";

function Gallery(props) {

  const [items, setItems] = useState();

  useEffect(() => {createItems()}, []);


  function createItems() {
    if (props.nftIds != undefined) {
      setItems(
        props.nftIds.map((id) => <Item id={id} key={id.toText()} role={props.role} />)
      );
    }
  }

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
