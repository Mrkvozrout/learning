import React from "react";

export default PriceLabel;


function PriceLabel(props) {
  return (
    <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
      <span className="disChip-label">{props.price} MRKV</span>
    </div>
  );
}
