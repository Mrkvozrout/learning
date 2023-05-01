import Principal "mo:base/Principal";


actor class NFT (nftName: Text, nftOwner: Principal, nftData: [Nat8]) = this {

  private let name = nftName;
  private let data = nftData;
  private var owner = nftOwner;


  public query func getName(): async Text {
    return name;
  };

  public query func getData(): async [Nat8] {
    return data;
  };

  public query func getOwner(): async Principal {
    return owner;
  };

  public query func getNftId(): async Principal {
    return Principal.fromActor(this);
  };

  public shared(msg) func transferOwnership(newOwner: Principal): async Text {
    if (not Principal.equal(owner, msg.caller)) {
      return "Not the owner.";
    };

    owner := newOwner;
    return "Success";
  };
}
