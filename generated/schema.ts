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

export class CommunityProposalEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("calldata", Value.fromBytes(Bytes.empty()));
    this.set("status", Value.fromI32(0));
    this.set("endBlock", Value.fromI32(0));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save CommunityProposalEntity entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save CommunityProposalEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("CommunityProposalEntity", id.toString(), this);
    }
  }

  static load(id: string): CommunityProposalEntity | null {
    return changetype<CommunityProposalEntity | null>(
      store.get("CommunityProposalEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get calldata(): Bytes {
    let value = this.get("calldata");
    return value!.toBytes();
  }

  set calldata(value: Bytes) {
    this.set("calldata", Value.fromBytes(value));
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

    this.set("startDayId", Value.fromI32(0));
    this.set("state", Value.fromI32(0));
    this.set("claimAmount", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("maxClaim", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("decreaseStep", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("baseInterval", Value.fromI32(0));
    this.set("incrementInterval", Value.fromI32(0));
    this.set("beneficiaries", Value.fromI32(0));
    this.set("removedBeneficiaries", Value.fromI32(0));
    this.set("managers", Value.fromI32(0));
    this.set("removedManagers", Value.fromI32(0));
    this.set("claimed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("claims", Value.fromI32(0));
    this.set("contributed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("contributors", Value.fromI32(0));
    this.set("contributions", Value.fromStringArray(new Array(0)));
    this.set("managerList", Value.fromStringArray(new Array(0)));
    this.set("estimatedFunds", Value.fromBigDecimal(BigDecimal.zero()));
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

  get startDayId(): i32 {
    let value = this.get("startDayId");
    return value!.toI32();
  }

  set startDayId(value: i32) {
    this.set("startDayId", Value.fromI32(value));
  }

  get state(): i32 {
    let value = this.get("state");
    return value!.toI32();
  }

  set state(value: i32) {
    this.set("state", Value.fromI32(value));
  }

  get previous(): Bytes | null {
    let value = this.get("previous");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set previous(value: Bytes | null) {
    if (!value) {
      this.unset("previous");
    } else {
      this.set("previous", Value.fromBytes(<Bytes>value));
    }
  }

  get migrated(): Bytes | null {
    let value = this.get("migrated");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set migrated(value: Bytes | null) {
    if (!value) {
      this.unset("migrated");
    } else {
      this.set("migrated", Value.fromBytes(<Bytes>value));
    }
  }

  get claimAmount(): BigDecimal {
    let value = this.get("claimAmount");
    return value!.toBigDecimal();
  }

  set claimAmount(value: BigDecimal) {
    this.set("claimAmount", Value.fromBigDecimal(value));
  }

  get maxClaim(): BigDecimal {
    let value = this.get("maxClaim");
    return value!.toBigDecimal();
  }

  set maxClaim(value: BigDecimal) {
    this.set("maxClaim", Value.fromBigDecimal(value));
  }

  get decreaseStep(): BigDecimal {
    let value = this.get("decreaseStep");
    return value!.toBigDecimal();
  }

  set decreaseStep(value: BigDecimal) {
    this.set("decreaseStep", Value.fromBigDecimal(value));
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

  get beneficiaries(): i32 {
    let value = this.get("beneficiaries");
    return value!.toI32();
  }

  set beneficiaries(value: i32) {
    this.set("beneficiaries", Value.fromI32(value));
  }

  get removedBeneficiaries(): i32 {
    let value = this.get("removedBeneficiaries");
    return value!.toI32();
  }

  set removedBeneficiaries(value: i32) {
    this.set("removedBeneficiaries", Value.fromI32(value));
  }

  get managers(): i32 {
    let value = this.get("managers");
    return value!.toI32();
  }

  set managers(value: i32) {
    this.set("managers", Value.fromI32(value));
  }

  get removedManagers(): i32 {
    let value = this.get("removedManagers");
    return value!.toI32();
  }

  set removedManagers(value: i32) {
    this.set("removedManagers", Value.fromI32(value));
  }

  get claimed(): BigDecimal {
    let value = this.get("claimed");
    return value!.toBigDecimal();
  }

  set claimed(value: BigDecimal) {
    this.set("claimed", Value.fromBigDecimal(value));
  }

  get claims(): i32 {
    let value = this.get("claims");
    return value!.toI32();
  }

  set claims(value: i32) {
    this.set("claims", Value.fromI32(value));
  }

  get contributed(): BigDecimal {
    let value = this.get("contributed");
    return value!.toBigDecimal();
  }

  set contributed(value: BigDecimal) {
    this.set("contributed", Value.fromBigDecimal(value));
  }

  get contributors(): i32 {
    let value = this.get("contributors");
    return value!.toI32();
  }

  set contributors(value: i32) {
    this.set("contributors", Value.fromI32(value));
  }

  get contributions(): Array<string> {
    let value = this.get("contributions");
    return value!.toStringArray();
  }

  set contributions(value: Array<string>) {
    this.set("contributions", Value.fromStringArray(value));
  }

  get managerList(): Array<string> {
    let value = this.get("managerList");
    return value!.toStringArray();
  }

  set managerList(value: Array<string>) {
    this.set("managerList", Value.fromStringArray(value));
  }

  get estimatedFunds(): BigDecimal {
    let value = this.get("estimatedFunds");
    return value!.toBigDecimal();
  }

  set estimatedFunds(value: BigDecimal) {
    this.set("estimatedFunds", Value.fromBigDecimal(value));
  }
}

export class CommunityDailyEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("community", Value.fromString(""));
    this.set("dayId", Value.fromI32(0));
    this.set("beneficiaries", Value.fromI32(0));
    this.set("managers", Value.fromI32(0));
    this.set("claimed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("contributed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("contributors", Value.fromI32(0));
    this.set("volume", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("transactions", Value.fromI32(0));
    this.set("reach", Value.fromI32(0));
    this.set("fundingRate", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save CommunityDailyEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save CommunityDailyEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("CommunityDailyEntity", id.toString(), this);
    }
  }

  static load(id: string): CommunityDailyEntity | null {
    return changetype<CommunityDailyEntity | null>(
      store.get("CommunityDailyEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get community(): string {
    let value = this.get("community");
    return value!.toString();
  }

  set community(value: string) {
    this.set("community", Value.fromString(value));
  }

  get dayId(): i32 {
    let value = this.get("dayId");
    return value!.toI32();
  }

  set dayId(value: i32) {
    this.set("dayId", Value.fromI32(value));
  }

  get beneficiaries(): i32 {
    let value = this.get("beneficiaries");
    return value!.toI32();
  }

  set beneficiaries(value: i32) {
    this.set("beneficiaries", Value.fromI32(value));
  }

  get managers(): i32 {
    let value = this.get("managers");
    return value!.toI32();
  }

  set managers(value: i32) {
    this.set("managers", Value.fromI32(value));
  }

  get claimed(): BigDecimal {
    let value = this.get("claimed");
    return value!.toBigDecimal();
  }

  set claimed(value: BigDecimal) {
    this.set("claimed", Value.fromBigDecimal(value));
  }

  get contributed(): BigDecimal {
    let value = this.get("contributed");
    return value!.toBigDecimal();
  }

  set contributed(value: BigDecimal) {
    this.set("contributed", Value.fromBigDecimal(value));
  }

  get contributors(): i32 {
    let value = this.get("contributors");
    return value!.toI32();
  }

  set contributors(value: i32) {
    this.set("contributors", Value.fromI32(value));
  }

  get volume(): BigDecimal {
    let value = this.get("volume");
    return value!.toBigDecimal();
  }

  set volume(value: BigDecimal) {
    this.set("volume", Value.fromBigDecimal(value));
  }

  get transactions(): i32 {
    let value = this.get("transactions");
    return value!.toI32();
  }

  set transactions(value: i32) {
    this.set("transactions", Value.fromI32(value));
  }

  get reach(): i32 {
    let value = this.get("reach");
    return value!.toI32();
  }

  set reach(value: i32) {
    this.set("reach", Value.fromI32(value));
  }

  get fundingRate(): BigDecimal {
    let value = this.get("fundingRate");
    return value!.toBigDecimal();
  }

  set fundingRate(value: BigDecimal) {
    this.set("fundingRate", Value.fromBigDecimal(value));
  }
}

export class UBIEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("communities", Value.fromI32(0));
    this.set("beneficiaries", Value.fromI32(0));
    this.set("managers", Value.fromI32(0));
    this.set("claimed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("contributed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("contributors", Value.fromI32(0));
    this.set("volume", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("transactions", Value.fromI32(0));
    this.set("reach", Value.fromI32(0));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UBIEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save UBIEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("UBIEntity", id.toString(), this);
    }
  }

  static load(id: string): UBIEntity | null {
    return changetype<UBIEntity | null>(store.get("UBIEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get communities(): i32 {
    let value = this.get("communities");
    return value!.toI32();
  }

  set communities(value: i32) {
    this.set("communities", Value.fromI32(value));
  }

  get beneficiaries(): i32 {
    let value = this.get("beneficiaries");
    return value!.toI32();
  }

  set beneficiaries(value: i32) {
    this.set("beneficiaries", Value.fromI32(value));
  }

  get managers(): i32 {
    let value = this.get("managers");
    return value!.toI32();
  }

  set managers(value: i32) {
    this.set("managers", Value.fromI32(value));
  }

  get claimed(): BigDecimal {
    let value = this.get("claimed");
    return value!.toBigDecimal();
  }

  set claimed(value: BigDecimal) {
    this.set("claimed", Value.fromBigDecimal(value));
  }

  get contributed(): BigDecimal {
    let value = this.get("contributed");
    return value!.toBigDecimal();
  }

  set contributed(value: BigDecimal) {
    this.set("contributed", Value.fromBigDecimal(value));
  }

  get contributors(): i32 {
    let value = this.get("contributors");
    return value!.toI32();
  }

  set contributors(value: i32) {
    this.set("contributors", Value.fromI32(value));
  }

  get volume(): BigDecimal {
    let value = this.get("volume");
    return value!.toBigDecimal();
  }

  set volume(value: BigDecimal) {
    this.set("volume", Value.fromBigDecimal(value));
  }

  get transactions(): i32 {
    let value = this.get("transactions");
    return value!.toI32();
  }

  set transactions(value: i32) {
    this.set("transactions", Value.fromI32(value));
  }

  get reach(): i32 {
    let value = this.get("reach");
    return value!.toI32();
  }

  set reach(value: i32) {
    this.set("reach", Value.fromI32(value));
  }
}

export class UBIDailyEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("communities", Value.fromI32(0));
    this.set("beneficiaries", Value.fromI32(0));
    this.set("managers", Value.fromI32(0));
    this.set("claimed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("contributed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("contributors", Value.fromI32(0));
    this.set("volume", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("transactions", Value.fromI32(0));
    this.set("reach", Value.fromI32(0));
    this.set("fundingRate", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UBIDailyEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save UBIDailyEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("UBIDailyEntity", id.toString(), this);
    }
  }

  static load(id: string): UBIDailyEntity | null {
    return changetype<UBIDailyEntity | null>(store.get("UBIDailyEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get communities(): i32 {
    let value = this.get("communities");
    return value!.toI32();
  }

  set communities(value: i32) {
    this.set("communities", Value.fromI32(value));
  }

  get beneficiaries(): i32 {
    let value = this.get("beneficiaries");
    return value!.toI32();
  }

  set beneficiaries(value: i32) {
    this.set("beneficiaries", Value.fromI32(value));
  }

  get managers(): i32 {
    let value = this.get("managers");
    return value!.toI32();
  }

  set managers(value: i32) {
    this.set("managers", Value.fromI32(value));
  }

  get claimed(): BigDecimal {
    let value = this.get("claimed");
    return value!.toBigDecimal();
  }

  set claimed(value: BigDecimal) {
    this.set("claimed", Value.fromBigDecimal(value));
  }

  get contributed(): BigDecimal {
    let value = this.get("contributed");
    return value!.toBigDecimal();
  }

  set contributed(value: BigDecimal) {
    this.set("contributed", Value.fromBigDecimal(value));
  }

  get contributors(): i32 {
    let value = this.get("contributors");
    return value!.toI32();
  }

  set contributors(value: i32) {
    this.set("contributors", Value.fromI32(value));
  }

  get volume(): BigDecimal {
    let value = this.get("volume");
    return value!.toBigDecimal();
  }

  set volume(value: BigDecimal) {
    this.set("volume", Value.fromBigDecimal(value));
  }

  get transactions(): i32 {
    let value = this.get("transactions");
    return value!.toI32();
  }

  set transactions(value: i32) {
    this.set("transactions", Value.fromI32(value));
  }

  get reach(): i32 {
    let value = this.get("reach");
    return value!.toI32();
  }

  set reach(value: i32) {
    this.set("reach", Value.fromI32(value));
  }

  get fundingRate(): BigDecimal {
    let value = this.get("fundingRate");
    return value!.toBigDecimal();
  }

  set fundingRate(value: BigDecimal) {
    this.set("fundingRate", Value.fromBigDecimal(value));
  }
}

export class ManagerEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("address", Value.fromBytes(Bytes.empty()));
    this.set("community", Value.fromString(""));
    this.set("state", Value.fromI32(0));
    this.set("added", Value.fromI32(0));
    this.set("removed", Value.fromI32(0));
    this.set("since", Value.fromI32(0));
    this.set("until", Value.fromI32(0));
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

  get added(): i32 {
    let value = this.get("added");
    return value!.toI32();
  }

  set added(value: i32) {
    this.set("added", Value.fromI32(value));
  }

  get removed(): i32 {
    let value = this.get("removed");
    return value!.toI32();
  }

  set removed(value: i32) {
    this.set("removed", Value.fromI32(value));
  }

  get since(): i32 {
    let value = this.get("since");
    return value!.toI32();
  }

  set since(value: i32) {
    this.set("since", Value.fromI32(value));
  }

  get until(): i32 {
    let value = this.get("until");
    return value!.toI32();
  }

  set until(value: i32) {
    this.set("until", Value.fromI32(value));
  }
}

export class BeneficiaryEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("address", Value.fromBytes(Bytes.empty()));
    this.set("community", Value.fromString(""));
    this.set("state", Value.fromI32(0));
    this.set("lastClaimAt", Value.fromI32(0));
    this.set("preLastClaimAt", Value.fromI32(0));
    this.set("claims", Value.fromI32(0));
    this.set("claimed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("since", Value.fromI32(0));
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

  get claims(): i32 {
    let value = this.get("claims");
    return value!.toI32();
  }

  set claims(value: i32) {
    this.set("claims", Value.fromI32(value));
  }

  get claimed(): BigDecimal {
    let value = this.get("claimed");
    return value!.toBigDecimal();
  }

  set claimed(value: BigDecimal) {
    this.set("claimed", Value.fromBigDecimal(value));
  }

  get since(): i32 {
    let value = this.get("since");
    return value!.toI32();
  }

  set since(value: i32) {
    this.set("since", Value.fromI32(value));
  }
}

export class UserActivityEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("user", Value.fromBytes(Bytes.empty()));
    this.set("by", Value.fromBytes(Bytes.empty()));
    this.set("community", Value.fromString(""));
    this.set("timestamp", Value.fromI32(0));
    this.set("activity", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserActivityEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save UserActivityEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("UserActivityEntity", id.toString(), this);
    }
  }

  static load(id: string): UserActivityEntity | null {
    return changetype<UserActivityEntity | null>(
      store.get("UserActivityEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get user(): Bytes {
    let value = this.get("user");
    return value!.toBytes();
  }

  set user(value: Bytes) {
    this.set("user", Value.fromBytes(value));
  }

  get by(): Bytes {
    let value = this.get("by");
    return value!.toBytes();
  }

  set by(value: Bytes) {
    this.set("by", Value.fromBytes(value));
  }

  get community(): string {
    let value = this.get("community");
    return value!.toString();
  }

  set community(value: string) {
    this.set("community", Value.fromString(value));
  }

  get timestamp(): i32 {
    let value = this.get("timestamp");
    return value!.toI32();
  }

  set timestamp(value: i32) {
    this.set("timestamp", Value.fromI32(value));
  }

  get activity(): string {
    let value = this.get("activity");
    return value!.toString();
  }

  set activity(value: string) {
    this.set("activity", Value.fromString(value));
  }
}

export class UserTransactionsEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("volume", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("transactions", Value.fromI32(0));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save UserTransactionsEntity entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save UserTransactionsEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("UserTransactionsEntity", id.toString(), this);
    }
  }

  static load(id: string): UserTransactionsEntity | null {
    return changetype<UserTransactionsEntity | null>(
      store.get("UserTransactionsEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get volume(): BigDecimal {
    let value = this.get("volume");
    return value!.toBigDecimal();
  }

  set volume(value: BigDecimal) {
    this.set("volume", Value.fromBigDecimal(value));
  }

  get transactions(): i32 {
    let value = this.get("transactions");
    return value!.toI32();
  }

  set transactions(value: i32) {
    this.set("transactions", Value.fromI32(value));
  }
}

export class UserTransactionWithEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("lastTransaction", Value.fromI32(0));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save UserTransactionWithEntity entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save UserTransactionWithEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("UserTransactionWithEntity", id.toString(), this);
    }
  }

  static load(id: string): UserTransactionWithEntity | null {
    return changetype<UserTransactionWithEntity | null>(
      store.get("UserTransactionWithEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get lastTransaction(): i32 {
    let value = this.get("lastTransaction");
    return value!.toI32();
  }

  set lastTransaction(value: i32) {
    this.set("lastTransaction", Value.fromI32(value));
  }
}

export class ContributorContributionsEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("to", Value.fromBytes(Bytes.empty()));
    this.set("contributed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("contributions", Value.fromI32(0));
    this.set("lastContribution", Value.fromI32(0));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save ContributorContributionsEntity entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ContributorContributionsEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ContributorContributionsEntity", id.toString(), this);
    }
  }

  static load(id: string): ContributorContributionsEntity | null {
    return changetype<ContributorContributionsEntity | null>(
      store.get("ContributorContributionsEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get to(): Bytes {
    let value = this.get("to");
    return value!.toBytes();
  }

  set to(value: Bytes) {
    this.set("to", Value.fromBytes(value));
  }

  get contributed(): BigDecimal {
    let value = this.get("contributed");
    return value!.toBigDecimal();
  }

  set contributed(value: BigDecimal) {
    this.set("contributed", Value.fromBigDecimal(value));
  }

  get contributions(): i32 {
    let value = this.get("contributions");
    return value!.toI32();
  }

  set contributions(value: i32) {
    this.set("contributions", Value.fromI32(value));
  }

  get lastContribution(): i32 {
    let value = this.get("lastContribution");
    return value!.toI32();
  }

  set lastContribution(value: i32) {
    this.set("lastContribution", Value.fromI32(value));
  }
}

export class ContributorEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("contributed", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("contributions", Value.fromI32(0));
    this.set("lastContribution", Value.fromI32(0));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ContributorEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ContributorEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ContributorEntity", id.toString(), this);
    }
  }

  static load(id: string): ContributorEntity | null {
    return changetype<ContributorEntity | null>(
      store.get("ContributorEntity", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contributed(): BigDecimal {
    let value = this.get("contributed");
    return value!.toBigDecimal();
  }

  set contributed(value: BigDecimal) {
    this.set("contributed", Value.fromBigDecimal(value));
  }

  get contributions(): i32 {
    let value = this.get("contributions");
    return value!.toI32();
  }

  set contributions(value: i32) {
    this.set("contributions", Value.fromI32(value));
  }

  get lastContribution(): i32 {
    let value = this.get("lastContribution");
    return value!.toI32();
  }

  set lastContribution(value: i32) {
    this.set("lastContribution", Value.fromI32(value));
  }
}
