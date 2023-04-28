import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

actor DBank {

  stable var currentValue: Float = 100;
  stable var startTime: Int = Time.now();

  public func topUp(amount: Float) {
    currentValue += amount;
    Debug.print(debug_show(currentValue));
  };

  public func withdraw(amount: Float) {
    let result: Float = currentValue - amount;
    if (result >= 0) {
      currentValue -= amount;
      Debug.print(debug_show(currentValue));
    }
    else {
      Debug.print("Not withdrawned, insufficient funds");
    }
  };

  public query func checkBalance(): async Float {
    return currentValue;
  };

  public func compound() {
    let currentTime = Time.now();
    let seconds = (currentTime - startTime) / 1_000_000_000;
    currentValue := currentValue * (1.01 ** Float.fromInt(seconds));
    startTime := currentTime;
  };
}
