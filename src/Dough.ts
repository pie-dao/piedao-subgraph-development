import { Approval, Delegate, Transfer } from "../generated/Dough/Dough"
import { NonTransferableRewardsOwnedHelper } from "../helpers/NonTransferableRewardsOwned"

export function handleApproval(event: Approval): void {
  NonTransferableRewardsOwnedHelper.updateStakingData(event.params._owner);
}

export function handleDelegate(event: Delegate): void {}

export function handleTransfer(event: Transfer): void {
  NonTransferableRewardsOwnedHelper.updateStakingData(event.params._to);
}
