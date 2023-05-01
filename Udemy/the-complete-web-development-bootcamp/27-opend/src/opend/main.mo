import Principal "mo:base/Principal";
import NftClass "../NFT/nft";
import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";


actor OpenD {

  private type Offering = {
    owner: Principal;
    price: Nat;
  };

  private var nftMap = HashMap.HashMap<Principal, NftClass.NFT>(1, Principal.equal, Principal.hash);
  private var ownerMap = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  private var offeringMap = HashMap.HashMap<Principal, Offering>(1, Principal.equal, Principal.hash);
 

  public shared(msg) func mintNft(name: Text, data: [Nat8]): async Principal {
    let owner = msg.caller;

    // Debug.print(debug_show(Cycles.balance()));
    Cycles.add(100_500_000_000);  //price for allocation of new canister + something to keep it alive
    let nft = await NftClass.NFT(name, owner, data);
    // Debug.print(debug_show(Cycles.balance()));

    let nftId = await nft.getNftId();

    Debug.print("NFT minted: owner=" # debug_show(owner) # ", name=" # name # ", id=" # debug_show(nftId));

    nftMap.put(nftId, nft);
    addToOwnerMap(owner, nftId);

    return nftId;
  };

  private func addToOwnerMap(owner: Principal, nftId: Principal) {
    var owned: List.List<Principal> = switch (ownerMap.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    owned := List.push(nftId, owned);

    ownerMap.put(owner, owned);
  };

  public query func getOwnedNftIds(user: Principal): async [Principal] {
    Debug.print("Getting nft ids: user=" # debug_show(user));

    var owned: List.List<Principal> = switch (ownerMap.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    return List.toArray(owned);
  };

  public query func getOfferedNfts(): async [Principal] {
    return Iter.toArray(offeringMap.keys());
  };

  public shared(msg) func offerNft(nftId: Principal, nftPrice: Nat): async Text {
    var nft: NftClass.NFT = switch (nftMap.get(nftId)) {
      case null return "NFT does not exist.";
      case (?result) result;
    };

    let nftOwner = await nft.getOwner();
    if (Principal.equal(nftOwner, msg.caller)) {
      var offering: Offering = {
        owner = nftOwner;
        price = nftPrice;
      };
      offeringMap.put(nftId, offering);
      return "Success";
    }
    else {
      return "Not the owner."
    }
  };

  public query func getCanisterId(): async Principal {
    return Principal.fromActor(OpenD);
  };

  public query func isOffered(nftId: Principal): async Bool {
    return offeringMap.get(nftId) != null;
  };

  public query func getOriginalOwner(nftId: Principal): async Principal {
    return switch (offeringMap.get(nftId)) {
      case null Principal.fromText("");
      case (?result) result.owner;
    }
  };

  public query func getNftPrice(nftId: Principal): async Nat {
    return switch (offeringMap.get(nftId)) {
      case null 0;
      case (?result) result.price;
    }
  };

  public shared(msg) func completePurchase(nftId: Principal, ownerId: Principal, newOwnerId: Principal): async Text {
    var purchasedNft = switch (nftMap.get(nftId)) {
      case null return "NFT does not exist.";
      case (?result) result;
    };

    var transferResult = await purchasedNft.transferOwnership(newOwnerId);
    if (transferResult == "Success") {
      offeringMap.delete(nftId);
      var ownedNfts : List.List<Principal> = switch (ownerMap.get(ownerId)) {
        case null List.nil<Principal>();
        case (?result) result;
      };

      ownedNfts := List.filter(ownedNfts, func (id: Principal): Bool {
        return nftId != id;
      });

      ownerMap.put(ownerId, ownedNfts);

      addToOwnerMap(newOwnerId, nftId);
      return "Success";
    }
    else {
      return transferResult;
    }
  };
};
