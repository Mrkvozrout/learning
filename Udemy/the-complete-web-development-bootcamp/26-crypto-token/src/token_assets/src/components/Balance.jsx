import React, { useState } from "react";
import { Principal } from "@dfinity/principal"
import { token } from "../../../declarations/token"

function Balance() {

  const [principalValue, setPrincipalValue] = useState("");
  const [balanceValue, setBalanceValue] = useState("");
  const [balanceAvailable, setBalanceAvailable] = useState(false);
  
  async function handleClick() {
    let principal = Principal.fromText(principalValue);
    let balance = await token.balanceOf(principal);
    let symbol = await token.getSymbol();
    setBalanceValue(balance.toLocaleString() + " " + symbol);
    setBalanceAvailable(true);
  }

  function onPrincipalChanged(e) {
    setPrincipalValue(e.target.value);
  }


  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={principalValue}
          onChange={onPrincipalChanged}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          type="button"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={!balanceAvailable}>This account has a balance of {balanceValue}.</p>
    </div>
  );
}

export default Balance;
