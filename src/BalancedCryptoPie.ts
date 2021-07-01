import { BigInt } from "@graphprotocol/graph-ts"
import {
  BalancedCryptoPie,
  Approval,
  CapChanged,
  CircuitBreakerChanged,
  CircuitBreakerTripped,
  ControllerChanged,
  JoinExitEnabledChanged,
  PublicSwapSet,
  PublicSwapSetterChanged,
  SwapFeeSet,
  TokenBinderChanged,
  TokensApproved,
  Transfer
} from "../generated/BalancedCryptoPie/BalancedCryptoPie"
import { ExampleEntity } from "../generated/schema"

export function handleApproval(event: Approval): void {}

export function handleCapChanged(event: CapChanged): void {}

export function handleCircuitBreakerChanged(
  event: CircuitBreakerChanged
): void {}

export function handleCircuitBreakerTripped(
  event: CircuitBreakerTripped
): void {}

export function handleControllerChanged(event: ControllerChanged): void {}

export function handleJoinExitEnabledChanged(
  event: JoinExitEnabledChanged
): void {}

export function handlePublicSwapSet(event: PublicSwapSet): void {}

export function handlePublicSwapSetterChanged(
  event: PublicSwapSetterChanged
): void {}

export function handleSwapFeeSet(event: SwapFeeSet): void {}

export function handleTokenBinderChanged(event: TokenBinderChanged): void {}

export function handleTokensApproved(event: TokensApproved): void {}

export function handleTransfer(event: Transfer): void {}
