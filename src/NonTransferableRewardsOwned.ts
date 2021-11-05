import {
  Approval,
  ClaimedFor,
  OwnershipTransferred,
  RewardsDistributed,
  RewardsRedistributed,
  RewardsWithdrawn,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/NonTransferableRewardsOwned/NonTransferableRewardsOwned"
import { ShareTimeLockHelper } from "../helpers/ShareTimeLockHelper"
// import { NonTransferableRewardsOwnedHelper } from "../helpers/NonTransferableRewardsOwned"
// import { Address, log } from "@graphprotocol/graph-ts"

export function handleRewardsWithdrawn(event: RewardsWithdrawn): void {
  // deprecated, in favor of MerkleTreeDistributor...
  // NonTransferableRewardsOwnedHelper.saveRewards(
  //   event.transaction.hash.toHex(), 
  //   event.block.timestamp, 
  //   event.params.fundsWithdrawn,
  //   event.params.by.toHex(),
  //   "claimed");

  //   ShareTimeLockHelper.updateStakingData(event.params.by);
}

export function handleRewardsRedistributed(event: RewardsRedistributed): void {
  // deprecated, in favor of MerkleTreeDistributor...
  // NonTransferableRewardsOwnedHelper.saveRewards(
  //   event.transaction.hash.toHex(), 
  //   event.block.timestamp, 
  //   event.params.amount,
  //   event.params.account.toHex(),
  //   "slashed");  

  //   NonTransferableRewardsOwnedHelper.updateAllStakingData();
}

export function handleRewardsDistributed(event: RewardsDistributed): void {
  // deprecated, in favor of MerkleTreeDistributor...
  // NonTransferableRewardsOwnedHelper.saveRewards(
  //   event.transaction.hash.toHex(), 
  //   event.block.timestamp, 
  //   event.params.rewardsDistributed,
  //   event.params.by.toHex(),
  //   "distributed");

  //   NonTransferableRewardsOwnedHelper.updateAllStakingData();
}

export function handleClaimedFor(event: ClaimedFor): void {
  // deprecated, in favor of MerkleTreeDistributor...
}

export function handleApproval(event: Approval): void {}

export function handleTransfer(event: Transfer): void {
  ShareTimeLockHelper.updateStakingData(event.params._to);
}

/*
 * Not Needed Functions for now.
 */

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
