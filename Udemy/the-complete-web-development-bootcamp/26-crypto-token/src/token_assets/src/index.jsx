import ReactDOM from 'react-dom'
import React from 'react'
import App from "./components/App";
import { AuthClient } from "@dfinity/auth-client";

const init = async () => {
  let authClient = await AuthClient.create();

  if (authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  }
  else {
    authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handleAuthenticated(authClient);
      }
    });
  }
}

async function handleAuthenticated(authClient) {
  let identity = await authClient.getIdentity();
  let authenticatedPrincipal =
   identity.getPrincipal()
     ? identity.getPrincipal().toString()
     : identity._principal
       ? identity._principal.toString()
       : "unknown";
  ReactDOM.render(<App authenticatedPrincipal={authenticatedPrincipal} />, document.getElementById("root"));
}

init();


