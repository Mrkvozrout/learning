import React from "react";

export default Button;


function Button(props) {
  return (
    <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
      <span
        onClick={props.handleClick}
        className="form-Chip-label"
      >
        {props.text}
      </span>
    </div>
  );
}
