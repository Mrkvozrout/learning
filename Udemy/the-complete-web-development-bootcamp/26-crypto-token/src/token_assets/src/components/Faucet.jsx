import React, { useState } from "react";
import { canisterId, createActor } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";

export default Faucet;


function Faucet(props) {

  const [buttonText, setButtonText] = useState("Gimme gimme");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  async function handleClick(event) {
    setButtonDisabled(true);

    let authenticatedCanister = await getAuthenticatedCanister();

    var success = await authenticatedCanister.faucetPayout();
    setButtonText(success ? 'Success' : 'Already claimed');
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free Mrkev tokens here! Claim 10,000 MRKV token to your account ({props.userPrincipal}).</label>
      <p className="trade-buttons">
        <button disabled={buttonDisabled} id="btn-payout" onClick={handleClick}>
          {buttonText}
        </button>
      </p>
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

  return authenticatedCanister;
}
