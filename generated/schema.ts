// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Stat extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Stat entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Stat entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Stat", id.toString(), this);
  }

  static load(id: string): Stat | null {
    return store.get("Stat", id) as Stat | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get locksCounter(): BigInt {
    let value = this.get("locksCounter");
    return value.toBigInt();
  }

  set locksCounter(value: BigInt) {
    this.set("locksCounter", Value.fromBigInt(value));
  }
}

export class Staker extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Staker entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Staker entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Staker", id.toString(), this);
  }

  static load(id: string): Staker | null {
    return store.get("Staker", id) as Staker | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get accountLocks(): Array<string> {
    let value = this.get("accountLocks");
    return value.toStringArray();
  }

  set accountLocks(value: Array<string>) {
    this.set("accountLocks", Value.fromStringArray(value));
  }

  get totalStaked(): BigInt {
    let value = this.get("totalStaked");
    return value.toBigInt();
  }

  set totalStaked(value: BigInt) {
    this.set("totalStaked", Value.fromBigInt(value));
  }

  get veTokenTotalSupply(): BigInt {
    let value = this.get("veTokenTotalSupply");
    return value.toBigInt();
  }

  set veTokenTotalSupply(value: BigInt) {
    this.set("veTokenTotalSupply", Value.fromBigInt(value));
  }

  get accountVeTokenBalance(): BigInt {
    let value = this.get("accountVeTokenBalance");
    return value.toBigInt();
  }

  set accountVeTokenBalance(value: BigInt) {
    this.set("accountVeTokenBalance", Value.fromBigInt(value));
  }

  get accountWithdrawableRewards(): BigInt {
    let value = this.get("accountWithdrawableRewards");
    return value.toBigInt();
  }

  set accountWithdrawableRewards(value: BigInt) {
    this.set("accountWithdrawableRewards", Value.fromBigInt(value));
  }

  get accountWithdrawnRewards(): BigInt {
    let value = this.get("accountWithdrawnRewards");
    return value.toBigInt();
  }

  set accountWithdrawnRewards(value: BigInt) {
    this.set("accountWithdrawnRewards", Value.fromBigInt(value));
  }

  get accountDepositTokenBalance(): BigInt {
    let value = this.get("accountDepositTokenBalance");
    return value.toBigInt();
  }

  set accountDepositTokenBalance(value: BigInt) {
    this.set("accountDepositTokenBalance", Value.fromBigInt(value));
  }

  get accountDepositTokenAllowance(): BigInt {
    let value = this.get("accountDepositTokenAllowance");
    return value.toBigInt();
  }

  set accountDepositTokenAllowance(value: BigInt) {
    this.set("accountDepositTokenAllowance", Value.fromBigInt(value));
  }
}

export class Lock extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Lock entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Lock entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Lock", id.toString(), this);
  }

  static load(id: string): Lock | null {
    return store.get("Lock", id) as Lock | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get lockId(): BigInt {
    let value = this.get("lockId");
    return value.toBigInt();
  }

  set lockId(value: BigInt) {
    this.set("lockId", Value.fromBigInt(value));
  }

  get lockDuration(): BigInt {
    let value = this.get("lockDuration");
    return value.toBigInt();
  }

  set lockDuration(value: BigInt) {
    this.set("lockDuration", Value.fromBigInt(value));
  }

  get lockedAt(): BigInt {
    let value = this.get("lockedAt");
    return value.toBigInt();
  }

  set lockedAt(value: BigInt) {
    this.set("lockedAt", Value.fromBigInt(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get staker(): string {
    let value = this.get("staker");
    return value.toString();
  }

  set staker(value: string) {
    this.set("staker", Value.fromString(value));
  }

  get withdrawn(): boolean {
    let value = this.get("withdrawn");
    return value.toBoolean();
  }

  set withdrawn(value: boolean) {
    this.set("withdrawn", Value.fromBoolean(value));
  }
}
