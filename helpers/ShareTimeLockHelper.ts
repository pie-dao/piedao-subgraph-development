import { SharesTimeLock } from "../generated/SharesTimeLock/SharesTimeLock"
import { Staker, Lock, GlobalStat, LocksTracker } from "../generated/schema"
import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { NonTransferableRewardsOwnedHelper } from "../helpers/NonTransferableRewardsOwned"

const UNIQUE_STAT_ID = "unique_stats_id";
const locksTrackerID = "LocksTrackerID";

export class ShareTimeLockHelper {
  constructor() {}

  static updateStakingData(contractAddress: Address, fromAddress: Address): Staker {
    // loading the contract, and calling the getStakingData function...
    let sharesTimeLock = SharesTimeLock.bind(contractAddress);
    let callResult = sharesTimeLock.try_getStakingData(fromAddress);

    if (callResult.reverted) {
      return null;
    } else {
      let stakingData = callResult.value;

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
  }

  static calculateLocksDurationAverage(): BigInt {
    let locksTracker = this.loadLocksTracker();
    let locks = locksTracker.locks;

    let locksDuration = BigInt.fromI32(0);
    
    for(let k = 0; k < locks.length; k += 1) {
      let lock = Lock.load(locks[k]);
      locksDuration = locksDuration.plus(lock.lockDuration);
    }

    return locksDuration.div(locksTracker.counter);
  } 

  static updateGlobalGlobalStats(staker: Staker, lock: Lock, newLock: Lock, type: string): GlobalStat {  
    // loading stats entity, or creating if it doesn't exist yet...
    let stats = GlobalStat.load(UNIQUE_STAT_ID);
    
    if (stats == null) {
      stats = new GlobalStat(UNIQUE_STAT_ID);
      stats.depositedLocksCounter = type == 'deposited' ? BigInt.fromI32(1) : BigInt.fromI32(0);
      stats.depositedLocksValue = lock ? lock.amount : BigInt.fromI32(0);
      stats.locksDuration = lock ? lock.lockDuration : BigInt.fromI32(0);

      stats.withdrawnLocksCounter = BigInt.fromI32(0);
      stats.withdrawnLocksValue = BigInt.fromI32(0);

      stats.ejectedLocksCounter = BigInt.fromI32(0);
      stats.ejectedLocksValue = BigInt.fromI32(0);

      stats.boostedLocksCounter = BigInt.fromI32(0);
      stats.boostedLocksValue = BigInt.fromI32(0);
    } else {
      if(type == 'deposited') {
        stats.depositedLocksCounter = stats.depositedLocksCounter.plus(BigInt.fromI32(1));
        stats.depositedLocksValue = stats.depositedLocksValue.plus(lock.amount);
        stats.locksDuration = this.calculateLocksDurationAverage();
      } else {
        if(type == 'withdrawn') {
          stats.withdrawnLocksCounter = stats.withdrawnLocksCounter.plus(BigInt.fromI32(1));
          stats.withdrawnLocksValue = stats.withdrawnLocksValue.plus(lock.amount);
        } else {
          if(type == 'ejected') {
            stats.ejectedLocksCounter = stats.ejectedLocksCounter.plus(BigInt.fromI32(1));
            stats.ejectedLocksValue = stats.ejectedLocksValue.plus(lock.amount);
          } else if(type == 'boosted') {
            stats.depositedLocksCounter = stats.depositedLocksCounter.plus(BigInt.fromI32(1));
            stats.boostedLocksCounter = stats.boostedLocksCounter.plus(BigInt.fromI32(1));
            stats.boostedLocksValue = stats.boostedLocksValue.plus(newLock.amount);
            stats.locksDuration = this.calculateLocksDurationAverage();
          }
        }
      }
    }

    // those values are always updated, coming from onChain call, so we can just override them...
    stats.totalStaked = staker.totalStaked;
    stats.veTokenTotalSupply = staker.veTokenTotalSupply;    

    // saving stats entity...
    stats.save();    
    return <GlobalStat>stats;
  }

  static depositLock(lockId: BigInt, lockDuration: BigInt, timestamp: BigInt, amount: BigInt, owner: string, boosted: boolean): Lock {
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
    lock.boosted = boosted;
    lock.boostedPointer = null;

    // saving lock entity...
    lock.save();

    // updating the locksTracker entity, to keep our locksIDs always in sync...
    let locksTracker = this.loadLocksTracker();

    let locks = locksTracker.locks;
    locks.push(lockEntityId);

    locksTracker.locks = locks;
    locksTracker.counter = locksTracker.counter.plus(BigInt.fromI32(1));
    
    locksTracker.save();
    return <Lock>lock;
  }

  static loadLocksTracker(): LocksTracker {
    // loading LockTracker entity, or creating if it doesn't exist yet...
    let locksTracker = LocksTracker.load(locksTrackerID);

    if (locksTracker == null) {
      locksTracker = new LocksTracker(locksTrackerID);
      locksTracker.counter = BigInt.fromI32(0);
      locksTracker.locks = new Array<string>();
      locksTracker.save();
    }

    return <LocksTracker>locksTracker;
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

  static boostToMax(contractAddress: Address, oldLockId: BigInt, newLockId: BigInt, owner: string, timestamp: BigInt): Lock[] {
    let sharesTimeLock = SharesTimeLock.bind(contractAddress);
    let maxLockDuration = sharesTimeLock.maxLockDuration();

    let lockEntityId = owner + "_" + oldLockId.toString();
    let lock = Lock.load(lockEntityId);

    let newLock = this.depositLock(newLockId, maxLockDuration, timestamp, lock.amount, owner, true);
    lock.boostedPointer = newLock.id;
    
    // saving lock entity...
    lock.save();

    return [<Lock>lock, <Lock>newLock];         
  }
}