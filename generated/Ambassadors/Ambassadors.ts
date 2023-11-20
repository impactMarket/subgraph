// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AmbassadorAccountReplaced extends ethereum.Event {
  get params(): AmbassadorAccountReplaced__Params {
    return new AmbassadorAccountReplaced__Params(this);
  }
}

export class AmbassadorAccountReplaced__Params {
  _event: AmbassadorAccountReplaced;

  constructor(event: AmbassadorAccountReplaced) {
    this._event = event;
  }

  get ambassadorIndex(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get entityAccount(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get oldAccount(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get newAccount(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class AmbassadorAdded extends ethereum.Event {
  get params(): AmbassadorAdded__Params {
    return new AmbassadorAdded__Params(this);
  }
}

export class AmbassadorAdded__Params {
  _event: AmbassadorAdded;

  constructor(event: AmbassadorAdded) {
    this._event = event;
  }

  get ambassador(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get entity(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class AmbassadorRemoved extends ethereum.Event {
  get params(): AmbassadorRemoved__Params {
    return new AmbassadorRemoved__Params(this);
  }
}

export class AmbassadorRemoved__Params {
  _event: AmbassadorRemoved;

  constructor(event: AmbassadorRemoved) {
    this._event = event;
  }

  get ambassador(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get entity(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class AmbassadorReplaced extends ethereum.Event {
  get params(): AmbassadorReplaced__Params {
    return new AmbassadorReplaced__Params(this);
  }
}

export class AmbassadorReplaced__Params {
  _event: AmbassadorReplaced;

  constructor(event: AmbassadorReplaced) {
    this._event = event;
  }

  get ambassadorIndex(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get entityAccount(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get oldAmbassador(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get newAmbassador(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class AmbassadorToCommunityUpdated extends ethereum.Event {
  get params(): AmbassadorToCommunityUpdated__Params {
    return new AmbassadorToCommunityUpdated__Params(this);
  }
}

export class AmbassadorToCommunityUpdated__Params {
  _event: AmbassadorToCommunityUpdated;

  constructor(event: AmbassadorToCommunityUpdated) {
    this._event = event;
  }

  get fromAmbassador(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get toAmbassador(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get community(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class AmbassadorTransfered extends ethereum.Event {
  get params(): AmbassadorTransfered__Params {
    return new AmbassadorTransfered__Params(this);
  }
}

export class AmbassadorTransfered__Params {
  _event: AmbassadorTransfered;

  constructor(event: AmbassadorTransfered) {
    this._event = event;
  }

  get ambassador(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get oldEntity(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get newEntity(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class CommunityRemoved extends ethereum.Event {
  get params(): CommunityRemoved__Params {
    return new CommunityRemoved__Params(this);
  }
}

export class CommunityRemoved__Params {
  _event: CommunityRemoved;

  constructor(event: CommunityRemoved) {
    this._event = event;
  }

  get ambassador(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get community(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class EntityAccountReplaced extends ethereum.Event {
  get params(): EntityAccountReplaced__Params {
    return new EntityAccountReplaced__Params(this);
  }
}

export class EntityAccountReplaced__Params {
  _event: EntityAccountReplaced;

  constructor(event: EntityAccountReplaced) {
    this._event = event;
  }

  get entityIndex(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get oldAccount(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get newAccount(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class EntityAdded extends ethereum.Event {
  get params(): EntityAdded__Params {
    return new EntityAdded__Params(this);
  }
}

export class EntityAdded__Params {
  _event: EntityAdded;

  constructor(event: EntityAdded) {
    this._event = event;
  }

  get entity(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class EntityRemoved extends ethereum.Event {
  get params(): EntityRemoved__Params {
    return new EntityRemoved__Params(this);
  }
}

export class EntityRemoved__Params {
  _event: EntityRemoved;

  constructor(event: EntityRemoved) {
    this._event = event;
  }

  get entity(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Ambassadors extends ethereum.SmartContract {
  static bind(address: Address): Ambassadors {
    return new Ambassadors("Ambassadors", address);
  }

  ambassadorByAddress(param0: Address): BigInt {
    let result = super.call(
      "ambassadorByAddress",
      "ambassadorByAddress(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_ambassadorByAddress(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "ambassadorByAddress",
      "ambassadorByAddress(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  ambassadorByIndex(param0: BigInt): Address {
    let result = super.call(
      "ambassadorByIndex",
      "ambassadorByIndex(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toAddress();
  }

  try_ambassadorByIndex(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "ambassadorByIndex",
      "ambassadorByIndex(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  ambassadorIndex(): BigInt {
    let result = super.call(
      "ambassadorIndex",
      "ambassadorIndex():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_ambassadorIndex(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "ambassadorIndex",
      "ambassadorIndex():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  ambassadorToEntity(param0: BigInt): BigInt {
    let result = super.call(
      "ambassadorToEntity",
      "ambassadorToEntity(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toBigInt();
  }

  try_ambassadorToEntity(param0: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "ambassadorToEntity",
      "ambassadorToEntity(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  communityAdmin(): Address {
    let result = super.call("communityAdmin", "communityAdmin():(address)", []);

    return result[0].toAddress();
  }

  try_communityAdmin(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "communityAdmin",
      "communityAdmin():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  communityToAmbassador(param0: Address): BigInt {
    let result = super.call(
      "communityToAmbassador",
      "communityToAmbassador(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_communityToAmbassador(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "communityToAmbassador",
      "communityToAmbassador(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  entityAmbassadors(param0: BigInt): BigInt {
    let result = super.call(
      "entityAmbassadors",
      "entityAmbassadors(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toBigInt();
  }

  try_entityAmbassadors(param0: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "entityAmbassadors",
      "entityAmbassadors(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  entityByAddress(param0: Address): BigInt {
    let result = super.call(
      "entityByAddress",
      "entityByAddress(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_entityByAddress(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "entityByAddress",
      "entityByAddress(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  entityByIndex(param0: BigInt): Address {
    let result = super.call(
      "entityByIndex",
      "entityByIndex(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toAddress();
  }

  try_entityByIndex(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "entityByIndex",
      "entityByIndex(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  entityIndex(): BigInt {
    let result = super.call("entityIndex", "entityIndex():(uint256)", []);

    return result[0].toBigInt();
  }

  try_entityIndex(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("entityIndex", "entityIndex():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getVersion(): BigInt {
    let result = super.call("getVersion", "getVersion():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getVersion(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getVersion", "getVersion():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  isAmbassador(_ambassador: Address): boolean {
    let result = super.call("isAmbassador", "isAmbassador(address):(bool)", [
      ethereum.Value.fromAddress(_ambassador)
    ]);

    return result[0].toBoolean();
  }

  try_isAmbassador(_ambassador: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isAmbassador", "isAmbassador(address):(bool)", [
      ethereum.Value.fromAddress(_ambassador)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isAmbassadorAt(_ambassador: Address, _entityAddress: Address): boolean {
    let result = super.call(
      "isAmbassadorAt",
      "isAmbassadorAt(address,address):(bool)",
      [
        ethereum.Value.fromAddress(_ambassador),
        ethereum.Value.fromAddress(_entityAddress)
      ]
    );

    return result[0].toBoolean();
  }

  try_isAmbassadorAt(
    _ambassador: Address,
    _entityAddress: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isAmbassadorAt",
      "isAmbassadorAt(address,address):(bool)",
      [
        ethereum.Value.fromAddress(_ambassador),
        ethereum.Value.fromAddress(_entityAddress)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isAmbassadorOf(_ambassador: Address, _community: Address): boolean {
    let result = super.call(
      "isAmbassadorOf",
      "isAmbassadorOf(address,address):(bool)",
      [
        ethereum.Value.fromAddress(_ambassador),
        ethereum.Value.fromAddress(_community)
      ]
    );

    return result[0].toBoolean();
  }

  try_isAmbassadorOf(
    _ambassador: Address,
    _community: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isAmbassadorOf",
      "isAmbassadorOf(address,address):(bool)",
      [
        ethereum.Value.fromAddress(_ambassador),
        ethereum.Value.fromAddress(_community)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class AddAmbassadorCall extends ethereum.Call {
  get inputs(): AddAmbassadorCall__Inputs {
    return new AddAmbassadorCall__Inputs(this);
  }

  get outputs(): AddAmbassadorCall__Outputs {
    return new AddAmbassadorCall__Outputs(this);
  }
}

export class AddAmbassadorCall__Inputs {
  _call: AddAmbassadorCall;

  constructor(call: AddAmbassadorCall) {
    this._call = call;
  }

  get _ambassador(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddAmbassadorCall__Outputs {
  _call: AddAmbassadorCall;

  constructor(call: AddAmbassadorCall) {
    this._call = call;
  }
}

export class AddEntityCall extends ethereum.Call {
  get inputs(): AddEntityCall__Inputs {
    return new AddEntityCall__Inputs(this);
  }

  get outputs(): AddEntityCall__Outputs {
    return new AddEntityCall__Outputs(this);
  }
}

export class AddEntityCall__Inputs {
  _call: AddEntityCall;

  constructor(call: AddEntityCall) {
    this._call = call;
  }

  get _entity(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddEntityCall__Outputs {
  _call: AddEntityCall;

  constructor(call: AddEntityCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _communityAdmin(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class RemoveAmbassadorCall extends ethereum.Call {
  get inputs(): RemoveAmbassadorCall__Inputs {
    return new RemoveAmbassadorCall__Inputs(this);
  }

  get outputs(): RemoveAmbassadorCall__Outputs {
    return new RemoveAmbassadorCall__Outputs(this);
  }
}

export class RemoveAmbassadorCall__Inputs {
  _call: RemoveAmbassadorCall;

  constructor(call: RemoveAmbassadorCall) {
    this._call = call;
  }

  get _ambassador(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemoveAmbassadorCall__Outputs {
  _call: RemoveAmbassadorCall;

  constructor(call: RemoveAmbassadorCall) {
    this._call = call;
  }
}

export class RemoveCommunityCall extends ethereum.Call {
  get inputs(): RemoveCommunityCall__Inputs {
    return new RemoveCommunityCall__Inputs(this);
  }

  get outputs(): RemoveCommunityCall__Outputs {
    return new RemoveCommunityCall__Outputs(this);
  }
}

export class RemoveCommunityCall__Inputs {
  _call: RemoveCommunityCall;

  constructor(call: RemoveCommunityCall) {
    this._call = call;
  }

  get _community(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemoveCommunityCall__Outputs {
  _call: RemoveCommunityCall;

  constructor(call: RemoveCommunityCall) {
    this._call = call;
  }
}

export class RemoveEntityCall extends ethereum.Call {
  get inputs(): RemoveEntityCall__Inputs {
    return new RemoveEntityCall__Inputs(this);
  }

  get outputs(): RemoveEntityCall__Outputs {
    return new RemoveEntityCall__Outputs(this);
  }
}

export class RemoveEntityCall__Inputs {
  _call: RemoveEntityCall;

  constructor(call: RemoveEntityCall) {
    this._call = call;
  }

  get _entity(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemoveEntityCall__Outputs {
  _call: RemoveEntityCall;

  constructor(call: RemoveEntityCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class ReplaceAmbassadorCall extends ethereum.Call {
  get inputs(): ReplaceAmbassadorCall__Inputs {
    return new ReplaceAmbassadorCall__Inputs(this);
  }

  get outputs(): ReplaceAmbassadorCall__Outputs {
    return new ReplaceAmbassadorCall__Outputs(this);
  }
}

export class ReplaceAmbassadorCall__Inputs {
  _call: ReplaceAmbassadorCall;

  constructor(call: ReplaceAmbassadorCall) {
    this._call = call;
  }

  get _oldAmbassador(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _newAmbassador(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ReplaceAmbassadorCall__Outputs {
  _call: ReplaceAmbassadorCall;

  constructor(call: ReplaceAmbassadorCall) {
    this._call = call;
  }
}

export class ReplaceAmbassadorAccountCall extends ethereum.Call {
  get inputs(): ReplaceAmbassadorAccountCall__Inputs {
    return new ReplaceAmbassadorAccountCall__Inputs(this);
  }

  get outputs(): ReplaceAmbassadorAccountCall__Outputs {
    return new ReplaceAmbassadorAccountCall__Outputs(this);
  }
}

export class ReplaceAmbassadorAccountCall__Inputs {
  _call: ReplaceAmbassadorAccountCall;

  constructor(call: ReplaceAmbassadorAccountCall) {
    this._call = call;
  }

  get _ambassador(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _newAmbassador(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ReplaceAmbassadorAccountCall__Outputs {
  _call: ReplaceAmbassadorAccountCall;

  constructor(call: ReplaceAmbassadorAccountCall) {
    this._call = call;
  }
}

export class ReplaceEntityAccountCall extends ethereum.Call {
  get inputs(): ReplaceEntityAccountCall__Inputs {
    return new ReplaceEntityAccountCall__Inputs(this);
  }

  get outputs(): ReplaceEntityAccountCall__Outputs {
    return new ReplaceEntityAccountCall__Outputs(this);
  }
}

export class ReplaceEntityAccountCall__Inputs {
  _call: ReplaceEntityAccountCall;

  constructor(call: ReplaceEntityAccountCall) {
    this._call = call;
  }

  get _entity(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _newEntity(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ReplaceEntityAccountCall__Outputs {
  _call: ReplaceEntityAccountCall;

  constructor(call: ReplaceEntityAccountCall) {
    this._call = call;
  }
}

export class SetCommunityToAmbassadorCall extends ethereum.Call {
  get inputs(): SetCommunityToAmbassadorCall__Inputs {
    return new SetCommunityToAmbassadorCall__Inputs(this);
  }

  get outputs(): SetCommunityToAmbassadorCall__Outputs {
    return new SetCommunityToAmbassadorCall__Outputs(this);
  }
}

export class SetCommunityToAmbassadorCall__Inputs {
  _call: SetCommunityToAmbassadorCall;

  constructor(call: SetCommunityToAmbassadorCall) {
    this._call = call;
  }

  get _ambassador(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _community(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class SetCommunityToAmbassadorCall__Outputs {
  _call: SetCommunityToAmbassadorCall;

  constructor(call: SetCommunityToAmbassadorCall) {
    this._call = call;
  }
}

export class TransferAmbassadorCall extends ethereum.Call {
  get inputs(): TransferAmbassadorCall__Inputs {
    return new TransferAmbassadorCall__Inputs(this);
  }

  get outputs(): TransferAmbassadorCall__Outputs {
    return new TransferAmbassadorCall__Outputs(this);
  }
}

export class TransferAmbassadorCall__Inputs {
  _call: TransferAmbassadorCall;

  constructor(call: TransferAmbassadorCall) {
    this._call = call;
  }

  get _ambassador(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _toEntity(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _keepCommunities(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }
}

export class TransferAmbassadorCall__Outputs {
  _call: TransferAmbassadorCall;

  constructor(call: TransferAmbassadorCall) {
    this._call = call;
  }
}

export class TransferCommunityToAmbassadorCall extends ethereum.Call {
  get inputs(): TransferCommunityToAmbassadorCall__Inputs {
    return new TransferCommunityToAmbassadorCall__Inputs(this);
  }

  get outputs(): TransferCommunityToAmbassadorCall__Outputs {
    return new TransferCommunityToAmbassadorCall__Outputs(this);
  }
}

export class TransferCommunityToAmbassadorCall__Inputs {
  _call: TransferCommunityToAmbassadorCall;

  constructor(call: TransferCommunityToAmbassadorCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _community(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class TransferCommunityToAmbassadorCall__Outputs {
  _call: TransferCommunityToAmbassadorCall;

  constructor(call: TransferCommunityToAmbassadorCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
