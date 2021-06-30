import { BigInt, BigDecimal, log, json } from "@graphprotocol/graph-ts"
import {
  SharesTimeLock,
  BoostedToMax,
  Deposited,
  Ejected,
  MinLockAmountChanged,
  OwnershipTransferred,
  WhitelistedChanged,
  Withdrawn
} from "../generated/SharesTimeLock/SharesTimeLock"
import { Lock, Staker, Stat } from "../generated/schema"

const UNIQUE_STAT_ID = "unique_stats_id";

export function handleDeposited(event: Deposited): void {
  let sharesTimeLock = SharesTimeLock.bind(event.address)
  let stakingData = sharesTimeLock.getStakingData(event.transaction.from);

  // loading staker entity, or creating if it doesn't exist yet...
  let staker = Staker.load(event.transaction.from.toHex());

  if (staker == null) {
    staker = new Staker(event.transaction.from.toHex());
  }

  staker.totalStaked = stakingData.totalStaked;
  staker.veTokenTotalSupply = stakingData.veTokenTotalSupply;
  staker.accountVeTokenBalance = stakingData.accountVeTokenBalance;
  staker.accountWithdrawableRewards = stakingData.accountWithdrawableRewards;
  staker.accountWithdrawnRewards = stakingData.accountWithdrawnRewards;
  staker.accountDepositTokenBalance = stakingData.accountDepositTokenBalance;
  staker.accountDepositTokenAllowance = stakingData.accountDepositTokenAllowance;
  staker.save();

  // loading lock entity, or creating if it doesn't exist yet...
  let lock = Lock.load(event.transaction.hash.toHex());

  if (lock == null) {
    lock = new Lock(event.transaction.hash.toHex());
  }

  // filling the lock entity...
  lock.lockId = BigInt.fromI32(0); // TODO: change me, this should be an event.params value...
  lock.lockDuration = event.params.lockDuration;
  lock.lockedAt = event.block.timestamp;
  lock.amount = event.params.amount;
  lock.staker = staker.id;
  lock.withdrawn = false;

  // saving lock entity...
  lock.save();

  // loading stats entity, or creating if it doesn't exist yet...
  let stats = Stat.load(UNIQUE_STAT_ID);
  
  if (stats == null) {
    stats = new Stat(UNIQUE_STAT_ID);
    stats.locksCounter = BigInt.fromI32(1);
  } else {
    stats.locksCounter = stats.locksCounter.plus(BigInt.fromI32(1));
  }

  // saving stats entity...
  stats.save();
}

export function handleBoostedToMax(event: BoostedToMax): void { }

export function handleEjected(event: Ejected): void { }

export function handleMinLockAmountChanged(event: MinLockAmountChanged): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

export function handleWhitelistedChanged(event: WhitelistedChanged): void { }

export function handleWithdrawn(event: Withdrawn): void { }
