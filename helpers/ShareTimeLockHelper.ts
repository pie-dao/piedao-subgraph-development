import { SharesTimeLock } from "../generated/SharesTimeLock/SharesTimeLock"
import { Staker, Lock, GlobalStat } from "../generated/schema"
import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { NonTransferableRewardsOwnedHelper } from "../helpers/NonTransferableRewardsOwned"

const UNIQUE_STAT_ID = "unique_stats_id";

export class ShareTimeLockHelper {
  constructor() {}

  static updateStakingData(contractAddress: Address, fromAddress: Address): Staker {
    // loading the contract, and calling the getStakingData function...
    let sharesTimeLock = SharesTimeLock.bind(contractAddress);
    let stakingData = sharesTimeLock.getStakingData(fromAddress);
  
    // loading staker entity, or creating if it doesn't exist yet...
    let staker = Staker.load(fromAddress.toHex());

    if (staker == null) {
      staker = new Staker(fromAddress.toHex());

      // updating the stakersTracker entity, to keep our stakerIDs always in sync...
      let stakersTracker = NonTransferableRewardsOwnedHelper.loadStakersTracker();

      let stakers = stakersTracker.stakers;
      stakers.push(fromAddress.toHexString());

      stakersTracker.stakers = stakers;
      stakersTracker.counter = stakersTracker.counter.plus(BigInt.fromI32(1));

      stakersTracker.save();
    }
  
    // refilling the staked entity...
    staker.totalStaked = stakingData.totalStaked;
    staker.veTokenTotalSupply = stakingData.veTokenTotalSupply;
    staker.accountVeTokenBalance = stakingData.accountVeTokenBalance;
    staker.accountWithdrawableRewards = stakingData.accountWithdrawableRewards;
    staker.accountWithdrawnRewards = stakingData.accountWithdrawnRewards;
    staker.accountDepositTokenBalance = stakingData.accountDepositTokenBalance;
    staker.accountDepositTokenAllowance = stakingData.accountDepositTokenAllowance;
    staker.save();
    
    return <Staker>staker;
  }

  static updateGlobalGlobalStats(): GlobalStat {
    // loading stats entity, or creating if it doesn't exist yet...
    let stats = GlobalStat.load(UNIQUE_STAT_ID);
    
    if (stats == null) {
      stats = new GlobalStat(UNIQUE_STAT_ID);
      stats.locksCounter = BigInt.fromI32(1);
    } else {
      stats.locksCounter = stats.locksCounter.plus(BigInt.fromI32(1));
    }

    // saving stats entity...
    stats.save();    
    return <GlobalStat>stats;
  }

  static depositLock(lockId: BigInt, lockDuration: BigInt, timestamp: BigInt, amount: BigInt, owner: string): Lock {
    // loading lock entity, or creating if it doesn't exist yet...
    let lockEntityId = owner + "_" + lockId.toString();
    let lock = Lock.load(lockEntityId);

    if (lock == null) {
      lock = new Lock(lockEntityId);
    }

    // filling the lock entity...
    lock.lockId = lockId;
    lock.lockDuration = lockDuration;
    lock.lockedAt = timestamp;
    lock.amount = amount;
    lock.staker = owner;
    lock.withdrawn = false;
    lock.ejected = false;
    lock.boosted = null;

    // saving lock entity...
    lock.save();   
    return <Lock>lock;
  }

  static withdrawLock(lockId: BigInt, owner: string, flagType: String): Lock {
    let lockEntityId = owner + "_" + lockId.toString();
    let lock = Lock.load(lockEntityId);

    if(flagType === "withdrawn") {
      lock.withdrawn = true;
    } else if(flagType === "ejected") {
      lock.ejected = true;      
    }
    
    // saving lock entity...
    lock.save();   
    return <Lock>lock;     
  }

  static boostToMax(oldLockId: BigInt, newLockId: BigInt, owner: string, timestamp: BigInt): Lock {
    let lockEntityId = owner + "_" + oldLockId.toString();
    let lock = Lock.load(lockEntityId);

    let newLock = this.depositLock(newLockId, lock.lockDuration, timestamp, lock.amount, owner);
    lock.boosted = newLock.id;
    
    // saving lock entity...
    lock.save();

    return <Lock>lock;         
  }
}