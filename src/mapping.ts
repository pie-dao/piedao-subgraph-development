import { BigInt, BigDecimal, log } from "@graphprotocol/graph-ts"
import {
  Staking,
  BoostedToMax,
  Deposited,
  Ejected,
  MinLockAmountChanged,
  OwnershipTransferred,
  WhitelistedChanged,
  Withdrawn
} from "../generated/Staking/Staking"
import { Lock } from "../generated/schema"

export function handleDeposited(event: Deposited): void {
  log.debug('handleDeposited: {}', [event.block.number.toString()]);

  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = Lock.load(event.transaction.hash.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new Lock(event.transaction.hash.toHex())
  }

  entity.lockDuration = event.params.lockDuration;
  entity.lockedAt = event.block.timestamp;
  entity.amount = event.params.amount;
  entity.receiver = event.params.owner;

  // Entities can be written to the store with `.save()`
  entity.save();  
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

export function handleEjected(event: Ejected): void {}

export function handleMinLockAmountChanged(event: MinLockAmountChanged): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleWhitelistedChanged(event: WhitelistedChanged): void {}

export function handleWithdrawn(event: Withdrawn): void {}
