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
import { Lock, Account, Stat } from "../generated/schema"

const UNIQUE_STAT_ID = "unique_stats_id";

export function handleDeposited(event: Deposited): void {
  let sharesTimeLock = SharesTimeLock.bind(event.address)
  let stakingData = sharesTimeLock.getStakingData(event.transaction.from);
  log.info("stakingData", ["here", stakingData.rewardTokenTotalSupply.toString()]);

  // loading account entity, or creating if it doesn't exist yet...
  let account = Account.load(event.transaction.from.toHex());

  if (account == null) {
    account = new Account(event.transaction.from.toHex());
  }

  account.totalStaked = stakingData.totalStaked;
  account.rewardTokenTotalSupply = stakingData.rewardTokenTotalSupply;
  account.accountRewardTokenBalance = stakingData.accountRewardTokenBalance;
  account.accountWithdrawableRewards = stakingData.accountWithdrawableRewards;
  account.accountWithdrawnRewards = stakingData.accountWithdrawnRewards;
  account.accountDepositTokenBalance = stakingData.accountDepositTokenBalance;
  account.accountDepositTokenAllowance = stakingData.accountDepositTokenAllowance;
  account.save();

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
  lock.account = account.id;
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

export function handleBoostedToMax(event: BoostedToMax): void {
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.canEject(...)
  // - contract.depositToken(...)
  // - contract.getLocksOfLength(...)
  // - contract.getRewardsMultiplier(...)
  // - contract.getStakingData(...)
  // - contract.locksOf(...)
  // - contract.maxLockDuration(...)
  // - contract.maxRatioArray(...)
  // - contract.minLockAmount(...)
  // - contract.minLockDuration(...)
  // - contract.owner(...)
  // - contract.rewardsToken(...)
  // - contract.secPerMonth(...)
  // - contract.whitelisted(...)
}

export function handleEjected(event: Ejected): void { }

export function handleMinLockAmountChanged(event: MinLockAmountChanged): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

export function handleWhitelistedChanged(event: WhitelistedChanged): void { }

export function handleWithdrawn(event: Withdrawn): void { }
