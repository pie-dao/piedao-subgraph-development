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

  ShareTimeLockHelper.updateLock(
    event.transaction.hash, 
    event.params.lockId, 
    event.params.lockDuration,
    event.block.timestamp,
    event.params.amount,
    staker);

  ShareTimeLockHelper.updateGlobalGlobalStats();
}

export function handleBoostedToMax(event: BoostedToMax): void { }

export function handleEjected(event: Ejected): void {

}

export function handleMinLockAmountChanged(event: MinLockAmountChanged): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

export function handleWhitelistedChanged(event: WhitelistedChanged): void { }

export function handleWithdrawn(event: Withdrawn): void { }
