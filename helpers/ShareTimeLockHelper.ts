import { SharesTimeLock } from "../generated/SharesTimeLock/SharesTimeLock"
import { Dough } from "../generated/Dough/Dough"
import { NonTransferableRewardsOwned } from "../generated/NonTransferableRewardsOwned/NonTransferableRewardsOwned"
import { Staker, Lock, GlobalStat, LocksTracker, GlobalStatsTracker } from "../generated/schema"
import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { NonTransferableRewardsOwnedHelper } from "../helpers/NonTransferableRewardsOwned"
import { SharesTimeLock_Address, NonTransferableRewardsOwned_Address, Dough_Address } from '../config/contracts'

const globalStatsID = "GlobalStatsID";
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
      staker.accountVeTokenBalance = stakingData.accountVeTokenBalance;
      staker.accountWithdrawableRewards = stakingData.accountWithdrawableRewards;
      staker.accountWithdrawnRewards = stakingData.accountWithdrawnRewards;
      staker.save();
      
      return <Staker>staker;
    }
  }

  static calculateLocksDurationAverage(): BigInt {
    let locksTracker = this.loadLocksTracker();
    let locks = locksTracker.locks;

    let averageTimeLock = BigInt.fromI32(0);
    let counter = 0;
    
    for(let k = 0; k < locks.length; k += 1) {
      let lock = Lock.load(locks[k]);
      if(lock.boostedPointer == '') {
        counter++;
        averageTimeLock = averageTimeLock.plus(lock.lockDuration);
      }
    }

    return averageTimeLock.div(BigInt.fromI32(counter));
  } 

  static loadGlobalStatsTracker(id: string): GlobalStatsTracker {
    let globalStatsTracker = GlobalStatsTracker.load(globalStatsID);

    if (globalStatsTracker == null) {
      globalStatsTracker = new GlobalStatsTracker(globalStatsID);
      globalStatsTracker.counter = BigInt.fromI32(0);
      globalStatsTracker.globalStats = new Array<string>();
      globalStatsTracker.latest = id;
      globalStatsTracker.save();
    }

    return <GlobalStatsTracker>globalStatsTracker;
  } 

  static updateGlobalStatsTracker(globalStatsTracker: GlobalStatsTracker, latest: string): GlobalStatsTracker {
    let globalStats = globalStatsTracker.globalStats;
    globalStats.push(latest);

    globalStatsTracker.globalStats = globalStats;
    globalStatsTracker.latest = latest;
    globalStatsTracker.counter = globalStatsTracker.counter.plus(BigInt.fromI32(1));
    
    globalStatsTracker.save();  
    return <GlobalStatsTracker>globalStatsTracker;  
  }

  static updateGlobalGlobalStats(timestamp: BigInt, lock: Lock, newLock: Lock, type: string): GlobalStat {  
    let globalStatsTracker = this.loadGlobalStatsTracker(timestamp.toString());

    let previous_stats = GlobalStat.load(globalStatsTracker.latest);
    let stats = new GlobalStat(timestamp.toString());
    
    if (previous_stats == null) {
      stats.depositedLocksCounter = BigInt.fromI32(0);
      stats.depositedLocksValue = BigInt.fromI32(0);
      stats.averageTimeLock = BigInt.fromI32(0);

      stats.withdrawnLocksCounter = BigInt.fromI32(0);
      stats.withdrawnLocksValue = BigInt.fromI32(0);

      stats.ejectedLocksCounter = BigInt.fromI32(0);
      stats.ejectedLocksValue = BigInt.fromI32(0);

      stats.boostedLocksCounter = BigInt.fromI32(0);
      stats.boostedLocksValue = BigInt.fromI32(0);
    } else {
      stats.depositedLocksCounter = previous_stats.depositedLocksCounter;
      stats.depositedLocksValue = previous_stats.depositedLocksValue;
      stats.averageTimeLock = previous_stats.averageTimeLock;

      stats.withdrawnLocksCounter = previous_stats.withdrawnLocksCounter;
      stats.withdrawnLocksValue = previous_stats.withdrawnLocksValue;

      stats.ejectedLocksCounter = previous_stats.ejectedLocksCounter;
      stats.ejectedLocksValue = previous_stats.ejectedLocksValue;

      stats.boostedLocksCounter = previous_stats.boostedLocksCounter;
      stats.boostedLocksValue = previous_stats.boostedLocksValue;      
    }

    if(type == 'deposited') {
      stats.depositedLocksCounter = stats.depositedLocksCounter.plus(BigInt.fromI32(1));
      stats.depositedLocksValue = stats.depositedLocksValue.plus(lock.amount);
      stats.averageTimeLock = this.calculateLocksDurationAverage();
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
          stats.averageTimeLock = this.calculateLocksDurationAverage();
        }
      }
    }    

    let DoughAddress = <Address> Address.fromHexString(Dough_Address);
    let DoughContract = Dough.bind(DoughAddress);
    stats.totalDoughStaked = DoughContract.balanceOf(<Address> Address.fromHexString(SharesTimeLock_Address));

    let veDoughAddress = <Address> Address.fromHexString(NonTransferableRewardsOwned_Address);
    let veDoughContract = NonTransferableRewardsOwned.bind(veDoughAddress);
    stats.veTokenTotalSupply = veDoughContract.totalSupply();

    let stakersTracker = NonTransferableRewardsOwnedHelper.loadStakersTracker();
    stats.stakersCounter = stakersTracker.counter;

    stats.timestamp = timestamp;

    this.updateGlobalStatsTracker(globalStatsTracker, timestamp.toString());

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