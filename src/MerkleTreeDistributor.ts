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
import { MerkleTreeDistributorHelper } from "../helpers/MerkleTreeDistributorHelper"
import { ShareTimeLockHelper } from "../helpers/ShareTimeLockHelper"
import { store } from "@graphprotocol/graph-ts"
import { RewardDistribution } from "../generated/schema"

export function handleClaimed(event: Claimed): void {
  MerkleTreeDistributorHelper.saveRewards(
    event.transaction.hash.toHex(), 
    event.block.timestamp, 
    event.params.amount,
    event.params.account.toHex(),
    event.params.rewardToken,
    "claimed",
    event.params.windowIndex,
    event.params.accountIndex);

    ShareTimeLockHelper.updateStakingData(event.params.account, event.params.amount);
}

export function handleCreatedWindow(event: CreatedWindow): RewardDistribution {
  // NOTE: add entity il reward token address
  // loading RewardDistribution entity, or creating if it doesn't exist yet...
  let hashID = event.params.windowIndex.toString();
  let rewardDistribution = RewardDistribution.load(hashID);

  if (rewardDistribution == null) {
    rewardDistribution = new RewardDistribution(hashID);
  }

  // filling the RewardDistribution entity...
  rewardDistribution.timestamp = event.block.timestamp;
  rewardDistribution.block = event.block.number;
  rewardDistribution.windowIndex = event.params.windowIndex;
  rewardDistribution.rewardsDeposited = event.params.rewardsDeposited;
  rewardDistribution.rewardToken = event.params.rewardToken;
  rewardDistribution.owner = event.params.owner;
  rewardDistribution.transaction = event.transaction.hash.toHex();

  // saving RewardDistribution entity...
  rewardDistribution.save();
  // finally, returning RewardDistribution entity...
  return <RewardDistribution>rewardDistribution;
}

export function handleDeleteWindow(event: DeleteWindow): void {
  store.remove('RewardDistribution', event.params.windowIndex.toString());
}

export function handleWithdrawRewards(event: WithdrawRewards): void {}

export function handleLockSet(event: LockSet): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
