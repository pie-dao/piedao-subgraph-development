import {
  Approval,
  ClaimedFor,
  OwnershipTransferred,
  RewardsDistributed,
  RewardsWithdrawn,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/NonTransferableRewardsOwned/NonTransferableRewardsOwned"
import { ShareTimeLockHelper } from "../helpers/ShareTimeLockHelper"

export function handleApproval(event: Approval): void {}

export function handleClaimedFor(event: ClaimedFor): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRewardsDistributed(event: RewardsDistributed): void {}

export function handleRewardsWithdrawn(event: RewardsWithdrawn): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {}
