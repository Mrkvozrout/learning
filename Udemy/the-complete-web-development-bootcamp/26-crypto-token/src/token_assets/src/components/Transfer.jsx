import React, { useState } from "react";
import { canisterId, createActor } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal"

export default Transfer;


function Transfer() {

  const [recipientId, setRecepientId] = useState("");
  const [amount, setAmount] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [transferResult, setTransferResult] = useState("");


  function validateInputs() {
    setButtonDisabled(
      !recipientId.length ||
      !amount.length || Number(amount) <= 0
    );
  }
  
  async function handleTransfer() {
    setButtonDisabled(true);
    
    let authenticatedCanister = await getAuthenticatedCanister();

    let recipientPrincipal = Principal.fromText(recipientId);
    let amountInt = parseInt(amount);

    if (!recipientPrincipal || !amountInt) {
      setTransferResult("Wrong principal or amount.");
      return;
    }

    let result = await authenticatedCanister.transfer(recipientPrincipal, amountInt);

    if (result) {
      setTransferResult("Funds transferred.");
    }
    else {
      setTransferResult("Cannot transfer funds.");
    }
    setButtonDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientId}
                onChange={(e) => {
                  setRecepientId(e.target.value);
                  validateInputs();
                }}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  validateInputs();
                }}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" type="button" onClick={handleTransfer} disabled={buttonDisabled} >
            Transfer
          </button>
        </p>
        <p>{transferResult}</p>
      </div>
    </div>
  );
}

async function getAuthenticatedCanister() {
  let authClient = await AuthClient.create();
  let identity = await authClient.getIdentity();

  let authenticatedCanister = createActor(canisterId, {
    agentOptions: {
      identity
    }
  });
}
