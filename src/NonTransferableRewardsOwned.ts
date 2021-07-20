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

export function handleRewardsDistributed(event: RewardsDistributed): void {}

export function handleRewardsRedistributed(event: RewardsRedistributed): void {}

export function handleClaimedFor(event: ClaimedFor): void {}

export function handleRewardsWithdrawn(event: RewardsWithdrawn): void {}

export function handleApproval(event: Approval): void {}

export function handleTransfer(event: Transfer): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
