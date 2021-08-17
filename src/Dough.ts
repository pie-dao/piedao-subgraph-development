import { Approval, Delegate, Transfer } from "../generated/Dough/Dough"
import { NonTransferableRewardsOwnedHelper } from "../helpers/NonTransferableRewardsOwned"
import { log } from "@graphprotocol/graph-ts"

export function handleApproval(event: Approval): void {}

export function handleDelegate(event: Delegate): void {}

export function handleTransfer(event: Transfer): void {
  NonTransferableRewardsOwnedHelper.updateStakingData(event.params._to);
}
