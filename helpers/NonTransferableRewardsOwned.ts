import { NonTransferableRewardsOwned } from "../generated/NonTransferableRewardsOwned/NonTransferableRewardsOwned"
import { Reward } from "../generated/schema"
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"

export class NonTransferableRewardsOwnedHelper {
  constructor() {}

  static saveRewards(hashID: string, timestamp: BigInt, amount: BigInt, by: string, type: string): Reward {
    // loading Reward entity, or creating if it doesn't exist yet...
    let reward = Reward.load(hashID);

    if (reward == null) {
      reward = new Reward(hashID);
    }

    // filling the Reward entity...
    reward.timestamp = timestamp;
    reward.amount = amount;
    reward.staker = by;
    reward.type = type;

    // saving lock entity...
    reward.save();   
    return <Reward>reward;
  }

}