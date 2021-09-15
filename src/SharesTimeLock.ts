import {
  BoostedToMax,
  Deposited,
  Ejected,
  MinLockAmountChanged,
  OwnershipTransferred,
  WhitelistedChanged,
  Withdrawn
} from "../generated/SharesTimeLock/SharesTimeLock"
import { ShareTimeLockHelper } from "../helpers/ShareTimeLockHelper"

export function handleDeposited(event: Deposited): void {
  // updating stakingData infos into Staker entity...
  let staker = ShareTimeLockHelper.updateStakingData(event.address, event.transaction.from);

  let lock = ShareTimeLockHelper.depositLock(
    event.params.lockId, 
    event.params.lockDuration,
    event.block.timestamp,
    event.params.amount,
    staker.id,
    false);

  ShareTimeLockHelper.updateGlobalGlobalStats(staker, lock, null, 'deposited');
}

export function handleEjected(event: Ejected): void {
  let lock = ShareTimeLockHelper.withdrawLock(
    event.params.lockId, 
    event.params.owner.toHex(),
    "ejected");

    let staker = ShareTimeLockHelper.updateStakingData(event.address, event.params.owner);
    ShareTimeLockHelper.updateGlobalGlobalStats(staker, lock, null, 'ejected');
}

export function handleWithdrawn(event: Withdrawn): void {
  let lock = ShareTimeLockHelper.withdrawLock(
    event.params.lockId, 
    event.params.owner.toHex(),
    "withdrawn");

    let staker = ShareTimeLockHelper.updateStakingData(event.address, event.params.owner);    
    ShareTimeLockHelper.updateGlobalGlobalStats(staker, lock, null, 'withdrawn');
}

export function handleBoostedToMax(event: BoostedToMax): void {
  let locks = ShareTimeLockHelper.boostToMax(
    event.address,
    event.params.oldLockId,
    event.params.newLockId, 
    event.params.owner.toHex(),
    event.block.timestamp);  

    let staker = ShareTimeLockHelper.updateStakingData(event.address, event.params.owner);    
    ShareTimeLockHelper.updateGlobalGlobalStats(staker, locks[0], locks[1], 'boosted');
}

export function handleMinLockAmountChanged(event: MinLockAmountChanged): void {
  ShareTimeLockHelper.updateStakingData(event.address, event.transaction.from);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  ShareTimeLockHelper.updateStakingData(event.address, event.transaction.from);
}

export function handleWhitelistedChanged(event: WhitelistedChanged): void {
  ShareTimeLockHelper.updateStakingData(event.address, event.transaction.from);
}
