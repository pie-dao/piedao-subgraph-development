import { BigInt } from "@graphprotocol/graph-ts"
import {
  MerkleTreeDistributor,
  Claimed,
  CreatedWindow,
  DeleteWindow,
  LockSet,
  OwnershipTransferred,
  WithdrawRewards
} from "../generated/MerkleTreeDistributor/MerkleTreeDistributor"

export function handleClaimed(event: Claimed): void {}

export function handleWithdrawRewards(event: WithdrawRewards): void {}

export function handleCreatedWindow(event: CreatedWindow): void {}

export function handleDeleteWindow(event: DeleteWindow): void {}

export function handleLockSet(event: LockSet): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
