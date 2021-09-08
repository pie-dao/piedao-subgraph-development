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

  ShareTimeLockHelper.depositLock(
    event.params.lockId, 
    event.params.lockDuration,
    event.block.timestamp,
    event.params.amount,
    staker.id,
    false);

  ShareTimeLockHelper.updateGlobalGlobalStats();
}

export function handleEjected(event: Ejected): void {
  ShareTimeLockHelper.withdrawLock(
    event.params.lockId, 
    event.params.owner.toHex(),
    "ejected");

    let staker = ShareTimeLockHelper.updateStakingData(event.address, event.params.owner);
    ShareTimeLockHelper.updateGlobalGlobalStats();
}

export function handleWithdrawn(event: Withdrawn): void {
  ShareTimeLockHelper.withdrawLock(
    event.params.lockId, 
    event.params.owner.toHex(),
    "withdrawn");

    let staker = ShareTimeLockHelper.updateStakingData(event.address, event.params.owner);    
    ShareTimeLockHelper.updateGlobalGlobalStats();
}

export function handleBoostedToMax(event: BoostedToMax): void {
  ShareTimeLockHelper.boostToMax(
    event.address,
    event.params.oldLockId,
    event.params.newLockId, 
    event.params.owner.toHex(),
    event.block.timestamp);  

    let staker = ShareTimeLockHelper.updateStakingData(event.address, event.params.owner);    
    ShareTimeLockHelper.updateGlobalGlobalStats();
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
