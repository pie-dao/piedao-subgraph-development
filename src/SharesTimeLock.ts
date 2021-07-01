import {
  BoostedToMax,
  Deposited,
  Ejected,
  MinLockAmountChanged,
  OwnershipTransferred,
  WhitelistedChanged,
  Withdrawn
} from "../generated/SharesTimeLock/SharesTimeLock"
import { ShareTimeLockHelper } from "../helpers/ShareTimeLockHelper";

export function handleDeposited(event: Deposited): void {
  // updating stakingData infos into Staker entity...
  let staker = ShareTimeLockHelper.updateStakingData(event.address, event.transaction.from);

  ShareTimeLockHelper.depositLock(
    event.params.lockId, 
    event.params.lockDuration,
    event.block.timestamp,
    event.params.amount,
    staker);

  ShareTimeLockHelper.updateGlobalGlobalStats();
}

export function handleEjected(event: Ejected): void {
  ShareTimeLockHelper.withdrawLock(
    event.params.lockId, 
    event.params.owner,
    "ejected");
}

export function handleWithdrawn(event: Withdrawn): void {
  ShareTimeLockHelper.withdrawLock(
    event.params.lockId, 
    event.params.owner,
    "withdrawn");
}

export function handleBoostedToMax(event: BoostedToMax): void {}

export function handleMinLockAmountChanged(event: MinLockAmountChanged): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

export function handleWhitelistedChanged(event: WhitelistedChanged): void { }
