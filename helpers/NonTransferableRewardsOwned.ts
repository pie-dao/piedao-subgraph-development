import { Reward, Staker, StakersTracker } from "../generated/schema"
import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { ShareTimeLockHelper } from "../helpers/ShareTimeLockHelper"

const stakersTrackerID = "StakersTrackerID";

export class NonTransferableRewardsOwnedHelper {
  constructor() {}
  
  static updateStakingData(fromAddress: Address): Staker {
    let sharesTimeLockAddress = <Address> Address.fromHexString("0x441658De8ebCB25d8D320Bd5C1Abb314b0CE195E");
    let staker = ShareTimeLockHelper.updateStakingData(sharesTimeLockAddress, fromAddress);
    return <Staker>staker;   
  }

  static loadStakersTracker(): StakersTracker {
    // loading StakersTracker entity, or creating if it doesn't exist yet...
    let stakersTracker = StakersTracker.load(stakersTrackerID);

    if (stakersTracker == null) {
      stakersTracker = new StakersTracker(stakersTrackerID);
      stakersTracker.counter = BigInt.fromI32(0);
      stakersTracker.stakers = new Array<string>();
      stakersTracker.save();
    }

    return <StakersTracker>stakersTracker;
  }

  static updateAllStakingData(): void {
    let sharesTimeLockAddress = <Address> Address.fromHexString("0x441658De8ebCB25d8D320Bd5C1Abb314b0CE195E");
    let stakersTracker = NonTransferableRewardsOwnedHelper.loadStakersTracker();

    stakersTracker.stakers.forEach(staker => {
      ShareTimeLockHelper.updateStakingData(sharesTimeLockAddress, Address.fromHexString(staker));
    });
  }  

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