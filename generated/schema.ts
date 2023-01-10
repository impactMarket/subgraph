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

export class AssetContributions extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save AssetContributions entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type AssetContributions must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("AssetContributions", id.toString(), this);
    }
  }

  static load(id: string): AssetContributions | null {
    return changetype<AssetContributions | null>(
      store.get("AssetContributions", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get asset(): Bytes {
    let value = this.get("asset");
    return value!.toBytes();
  }

  set asset(value: Bytes) {
    this.set("asset", Value.fromBytes(value));
  }

  get amount(): BigDecimal {
    let value = this.get("amount");
    return value!.toBigDecimal();
  }

  set amount(value: BigDecimal) {
    this.set("amount", Value.fromBigDecimal(value));
  }
}

export class CommunityEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save CommunityEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type CommunityEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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

  get originalClaimAmount(): BigDecimal {
    let value = this.get("originalClaimAmount");
    return value!.toBigDecimal();
  }

  set originalClaimAmount(value: BigDecimal) {
    this.set("originalClaimAmount", Value.fromBigDecimal(value));
  }

  get maxClaim(): BigDecimal {
    let value = this.get("maxClaim");
    return value!.toBigDecimal();
  }

  set maxClaim(value: BigDecimal) {
    this.set("maxClaim", Value.fromBigDecimal(value));
  }

  get maxTotalClaim(): BigDecimal {
    let value = this.get("maxTotalClaim");
    return value!.toBigDecimal();
  }

  set maxTotalClaim(value: BigDecimal) {
    this.set("maxTotalClaim", Value.fromBigDecimal(value));
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

  get maxBeneficiaries(): i32 {
    let value = this.get("maxBeneficiaries");
    return value!.toI32();
  }

  set maxBeneficiaries(value: i32) {
    this.set("maxBeneficiaries", Value.fromI32(value));
  }

  get removedBeneficiaries(): i32 {
    let value = this.get("removedBeneficiaries");
    return value!.toI32();
  }

  set removedBeneficiaries(value: i32) {
    this.set("removedBeneficiaries", Value.fromI32(value));
  }

  get lockedBeneficiaries(): i32 {
    let value = this.get("lockedBeneficiaries");
    return value!.toI32();
  }

  set lockedBeneficiaries(value: i32) {
    this.set("lockedBeneficiaries", Value.fromI32(value));
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

  get minTranche(): BigDecimal {
    let value = this.get("minTranche");
    return value!.toBigDecimal();
  }

  set minTranche(value: BigDecimal) {
    this.set("minTranche", Value.fromBigDecimal(value));
  }

  get maxTranche(): BigDecimal {
    let value = this.get("maxTranche");
    return value!.toBigDecimal();
  }

  set maxTranche(value: BigDecimal) {
    this.set("maxTranche", Value.fromBigDecimal(value));
  }

  get lastActivity(): i32 {
    let value = this.get("lastActivity");
    return value!.toI32();
  }

  set lastActivity(value: i32) {
    this.set("lastActivity", Value.fromI32(value));
  }
}

export class CommunityDailyEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save CommunityDailyEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type CommunityDailyEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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

export class UBIDailyEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UBIDailyEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UBIDailyEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ManagerEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ManagerEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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

  get addedBy(): Bytes {
    let value = this.get("addedBy");
    return value!.toBytes();
  }

  set addedBy(value: Bytes) {
    this.set("addedBy", Value.fromBytes(value));
  }

  get removedBy(): Bytes | null {
    let value = this.get("removedBy");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set removedBy(value: Bytes | null) {
    if (!value) {
      this.unset("removedBy");
    } else {
      this.set("removedBy", Value.fromBytes(<Bytes>value));
    }
  }

  get lastActivity(): i32 {
    let value = this.get("lastActivity");
    return value!.toI32();
  }

  set lastActivity(value: i32) {
    this.set("lastActivity", Value.fromI32(value));
  }
}

export class BeneficiaryEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save BeneficiaryEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type BeneficiaryEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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

  get addedBy(): Bytes {
    let value = this.get("addedBy");
    return value!.toBytes();
  }

  set addedBy(value: Bytes) {
    this.set("addedBy", Value.fromBytes(value));
  }

  get removedBy(): Bytes | null {
    let value = this.get("removedBy");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set removedBy(value: Bytes | null) {
    if (!value) {
      this.unset("removedBy");
    } else {
      this.set("removedBy", Value.fromBytes(<Bytes>value));
    }
  }

  get lastActivity(): i32 {
    let value = this.get("lastActivity");
    return value!.toI32();
  }

  set lastActivity(value: i32) {
    this.set("lastActivity", Value.fromI32(value));
  }
}

export class UserActivityEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserActivityEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UserActivityEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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
        `Entities of type UserTransactionsEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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

  get sentTxs(): i32 {
    let value = this.get("sentTxs");
    return value!.toI32();
  }

  set sentTxs(value: i32) {
    this.set("sentTxs", Value.fromI32(value));
  }

  get receivedTxs(): i32 {
    let value = this.get("receivedTxs");
    return value!.toI32();
  }

  set receivedTxs(value: i32) {
    this.set("receivedTxs", Value.fromI32(value));
  }
}

export class UserTransactionWithEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
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
        `Entities of type UserTransactionWithEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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
        `Entities of type ContributorContributionsEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ContributorEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ContributorEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
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

  get contributions(): Array<string> {
    let value = this.get("contributions");
    return value!.toStringArray();
  }

  set contributions(value: Array<string>) {
    this.set("contributions", Value.fromStringArray(value));
  }

  get lastContribution(): i32 {
    let value = this.get("lastContribution");
    return value!.toI32();
  }

  set lastContribution(value: i32) {
    this.set("lastContribution", Value.fromI32(value));
  }

  get pact(): BigDecimal {
    let value = this.get("pact");
    return value!.toBigDecimal();
  }

  set pact(value: BigDecimal) {
    this.set("pact", Value.fromBigDecimal(value));
  }

  get staking(): BigDecimal {
    let value = this.get("staking");
    return value!.toBigDecimal();
  }

  set staking(value: BigDecimal) {
    this.set("staking", Value.fromBigDecimal(value));
  }

  get lastPACTActivity(): i32 {
    let value = this.get("lastPACTActivity");
    return value!.toI32();
  }

  set lastPACTActivity(value: i32) {
    this.set("lastPACTActivity", Value.fromI32(value));
  }
}

export class DepositAsset extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DepositAsset entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type DepositAsset must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("DepositAsset", id.toString(), this);
    }
  }

  static load(id: string): DepositAsset | null {
    return changetype<DepositAsset | null>(store.get("DepositAsset", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get asset(): Bytes {
    let value = this.get("asset");
    return value!.toBytes();
  }

  set asset(value: Bytes) {
    this.set("asset", Value.fromBytes(value));
  }

  get deposited(): BigDecimal {
    let value = this.get("deposited");
    return value!.toBigDecimal();
  }

  set deposited(value: BigDecimal) {
    this.set("deposited", Value.fromBigDecimal(value));
  }

  get interest(): BigDecimal {
    let value = this.get("interest");
    return value!.toBigDecimal();
  }

  set interest(value: BigDecimal) {
    this.set("interest", Value.fromBigDecimal(value));
  }
}

export class Depositor extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Depositor entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Depositor must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Depositor", id.toString(), this);
    }
  }

  static load(id: string): Depositor | null {
    return changetype<Depositor | null>(store.get("Depositor", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get assets(): Array<string> {
    let value = this.get("assets");
    return value!.toStringArray();
  }

  set assets(value: Array<string>) {
    this.set("assets", Value.fromStringArray(value));
  }
}

export class DepositRedirectDaily extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DepositRedirectDaily entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type DepositRedirectDaily must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("DepositRedirectDaily", id.toString(), this);
    }
  }

  static load(id: string): DepositRedirectDaily | null {
    return changetype<DepositRedirectDaily | null>(
      store.get("DepositRedirectDaily", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get assets(): Array<string> {
    let value = this.get("assets");
    return value!.toStringArray();
  }

  set assets(value: Array<string>) {
    this.set("assets", Value.fromStringArray(value));
  }
}

export class DepositRedirectToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DepositRedirectToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type DepositRedirectToken must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("DepositRedirectToken", id.toString(), this);
    }
  }

  static load(id: string): DepositRedirectToken | null {
    return changetype<DepositRedirectToken | null>(
      store.get("DepositRedirectToken", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get active(): boolean {
    let value = this.get("active");
    return value!.toBoolean();
  }

  set active(value: boolean) {
    this.set("active", Value.fromBoolean(value));
  }

  get deposited(): BigDecimal {
    let value = this.get("deposited");
    return value!.toBigDecimal();
  }

  set deposited(value: BigDecimal) {
    this.set("deposited", Value.fromBigDecimal(value));
  }

  get interest(): BigDecimal {
    let value = this.get("interest");
    return value!.toBigDecimal();
  }

  set interest(value: BigDecimal) {
    this.set("interest", Value.fromBigDecimal(value));
  }
}
