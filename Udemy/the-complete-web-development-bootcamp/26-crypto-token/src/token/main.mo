import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";


actor Token {

  let owner: Principal = Principal.fromText("ropgj-6kku2-t23ag-u75vz-e4txm-gxcc3-n7y2p-xm4vq-beayp-soc35-nae");
  let totalSupply: Nat = 1_000_000_000;
  let symbol: Text = "MRKV";
  let faucetAmount: Nat = 10_000;

  // stable data to keep balances across updates
  private stable var balanceEntries: [(Principal, Nat)] = [];

  // Map view on balances for quick lookup
  private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);


  system func preupgrade() {
    balanceEntries := Iter.toArray(balances.entries());
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), balanceEntries.size(), Principal.equal, Principal.hash);
    if (balances.size() < 1) {
      balances.put(owner, totalSupply);
    }
  };


  public query func balanceOf(who: Principal): async Nat {
    Debug.print("Requested balance: who=" # debug_show(who));

    return switch (balances.get(who)) {
      case null 0;
      case (?balance) balance;
    }
  };

  public query func getSymbol(): async Text {
    return symbol;
  };

  public shared(msg) func faucetPayout(): async Bool {
    Debug.print("Requested faucet payout: caller=" # debug_show(msg.caller));

    var balance = balances.get(msg.caller);
    if (balance == null) {
      return await transfer(msg.caller, faucetAmount);
    }
    else {
      return false;
    }
  };

  public shared(msg) func transfer(to: Principal, amount: Nat): async Bool {
    Debug.print("Transfer: amount=" # debug_show(amount) # ", from=" # debug_show(msg.caller) # ", to=" # debug_show(to));

    let fromBalance: Nat = await balanceOf(msg.caller);

    if (fromBalance >= amount) {
      let toBalance: Nat = await balanceOf(to);
      balances.put(msg.caller, fromBalance - amount);
      balances.put(to, toBalance + amount);
      return true;
    };

    return false;
  };
};
