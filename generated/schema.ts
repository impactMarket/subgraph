// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class ProposalEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ProposalEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ProposalEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ProposalEntity", id.toString(), this);
    }
  }

  static load(id: string): ProposalEntity | null {
    return changetype<ProposalEntity | null>(store.get("ProposalEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get status(): i32 {
    let value = this.get("status");
    return value!.toI32();
  }

  set status(value: i32) {
    this.set("status", Value.fromI32(value));
  }

  get endBlock(): i32 {
    let value = this.get("endBlock");
    return value!.toI32();
  }

  set endBlock(value: i32) {
    this.set("endBlock", Value.fromI32(value));
  }
}

export class CommunityEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("previous", Value.fromBytes(Bytes.empty()));
    this.set("claimAmount", Value.fromBigInt(BigInt.zero()));
    this.set("maxClaim", Value.fromBigInt(BigInt.zero()));
    this.set("decreaseStep", Value.fromBigInt(BigInt.zero()));
    this.set("totalContributed", Value.fromBigInt(BigInt.zero()));
    this.set("totalClaimed", Value.fromBigInt(BigInt.zero()));
    this.set("managers", Value.fromStringArray(new Array(0)));
    this.set("beneficiaries", Value.fromStringArray(new Array(0)));
    this.set("claims", Value.fromStringArray(new Array(0)));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save CommunityEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save CommunityEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("CommunityEntity", id.toString(), this);
    }
  }

  static load(id: string): CommunityEntity | null {
    return changetype<CommunityEntity | null>(store.get("CommunityEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get previous(): Bytes {
    let value = this.get("previous");
    return value!.toBytes();
  }

  set previous(value: Bytes) {
    this.set("previous", Value.fromBytes(value));
  }

  get claimAmount(): BigInt {
    let value = this.get("claimAmount");
    return value!.toBigInt();
  }

  set claimAmount(value: BigInt) {
    this.set("claimAmount", Value.fromBigInt(value));
  }

  get maxClaim(): BigInt {
    let value = this.get("maxClaim");
    return value!.toBigInt();
  }

  set maxClaim(value: BigInt) {
    this.set("maxClaim", Value.fromBigInt(value));
  }

  get decreaseStep(): BigInt {
    let value = this.get("decreaseStep");
    return value!.toBigInt();
  }

  set decreaseStep(value: BigInt) {
    this.set("decreaseStep", Value.fromBigInt(value));
  }

  get baseInterval(): i32 {
    let value = this.get("baseInterval");
    return value!.toI32();
  }

  set baseInterval(value: i32) {
    this.set("baseInterval", Value.fromI32(value));
  }

  get incrementInterval(): i32 {
    let value = this.get("incrementInterval");
    return value!.toI32();
  }

  set incrementInterval(value: i32) {
    this.set("incrementInterval", Value.fromI32(value));
  }

  get totalBeneficiaries(): i32 {
    let value = this.get("totalBeneficiaries");
    return value!.toI32();
  }

  set totalBeneficiaries(value: i32) {
    this.set("totalBeneficiaries", Value.fromI32(value));
  }

  get totalManagers(): i32 {
    let value = this.get("totalManagers");
    return value!.toI32();
  }

  set totalManagers(value: i32) {
    this.set("totalManagers", Value.fromI32(value));
  }

  get totalContributed(): BigInt {
    let value = this.get("totalContributed");
    return value!.toBigInt();
  }

  set totalContributed(value: BigInt) {
    this.set("totalContributed", Value.fromBigInt(value));
  }

  get totalClaimed(): BigInt {
    let value = this.get("totalClaimed");
    return value!.toBigInt();
  }

  set totalClaimed(value: BigInt) {
    this.set("totalClaimed", Value.fromBigInt(value));
  }

  get managers(): Array<string> {
    let value = this.get("managers");
    return value!.toStringArray();
  }

  set managers(value: Array<string>) {
    this.set("managers", Value.fromStringArray(value));
  }

  get beneficiaries(): Array<string> {
    let value = this.get("beneficiaries");
    return value!.toStringArray();
  }

  set beneficiaries(value: Array<string>) {
    this.set("beneficiaries", Value.fromStringArray(value));
  }

  get claims(): Array<string> {
    let value = this.get("claims");
    return value!.toStringArray();
  }

  set claims(value: Array<string>) {
    this.set("claims", Value.fromStringArray(value));
  }
}

export class ManagerEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("address", Value.fromBytes(Bytes.empty()));
    this.set("community", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ManagerEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ManagerEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ManagerEntity", id.toString(), this);
    }
  }

  static load(id: string): ManagerEntity | null {
    return changetype<ManagerEntity | null>(store.get("ManagerEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value!.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get community(): string {
    let value = this.get("community");
    return value!.toString();
  }

  set community(value: string) {
    this.set("community", Value.fromString(value));
  }

  get state(): i32 {
    let value = this.get("state");
    return value!.toI32();
  }

  set state(value: i32) {
    this.set("state", Value.fromI32(value));
  }
}

export class BeneficiaryEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("address", Value.fromBytes(Bytes.empty()));
    this.set("community", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save BeneficiaryEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save BeneficiaryEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("BeneficiaryEntity", id.toString(), this);
    }
  }

  static load(id: string): BeneficiaryEntity | null {
    return changetype<BeneficiaryEntity | null>(
      store.get("BeneficiaryEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value!.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get community(): string {
    let value = this.get("community");
    return value!.toString();
  }

  set community(value: string) {
    this.set("community", Value.fromString(value));
  }

  get state(): i32 {
    let value = this.get("state");
    return value!.toI32();
  }

  set state(value: i32) {
    this.set("state", Value.fromI32(value));
  }

  get lastClaimAt(): i32 {
    let value = this.get("lastClaimAt");
    return value!.toI32();
  }

  set lastClaimAt(value: i32) {
    this.set("lastClaimAt", Value.fromI32(value));
  }

  get preLastClaimAt(): i32 {
    let value = this.get("preLastClaimAt");
    return value!.toI32();
  }

  set preLastClaimAt(value: i32) {
    this.set("preLastClaimAt", Value.fromI32(value));
  }
}

export class ClaimEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("beneficiary", Value.fromString(""));
    this.set("community", Value.fromString(""));
    this.set("amount", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ClaimEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ClaimEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ClaimEntity", id.toString(), this);
    }
  }

  static load(id: string): ClaimEntity | null {
    return changetype<ClaimEntity | null>(store.get("ClaimEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get beneficiary(): string {
    let value = this.get("beneficiary");
    return value!.toString();
  }

  set beneficiary(value: string) {
    this.set("beneficiary", Value.fromString(value));
  }

  get community(): string {
    let value = this.get("community");
    return value!.toString();
  }

  set community(value: string) {
    this.set("community", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get timestamp(): i32 {
    let value = this.get("timestamp");
    return value!.toI32();
  }

  set timestamp(value: i32) {
    this.set("timestamp", Value.fromI32(value));
  }
}
