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

export class CommunityAdded extends ethereum.Event {
  get params(): CommunityAdded__Params {
    return new CommunityAdded__Params(this);
  }
}

export class CommunityAdded__Params {
  _event: CommunityAdded;

  constructor(event: CommunityAdded) {
    this._event = event;
  }

  get communityAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get managers(): Array<Address> {
    return this._event.parameters[1].value.toAddressArray();
  }

  get claimAmount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get maxClaim(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get decreaseStep(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get baseInterval(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get incrementInterval(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get minTranche(): BigInt {
    return this._event.parameters[7].value.toBigInt();
  }

  get maxTranche(): BigInt {
    return this._event.parameters[8].value.toBigInt();
  }
}

export class CommunityFunded extends ethereum.Event {
  get params(): CommunityFunded__Params {
    return new CommunityFunded__Params(this);
  }
}

export class CommunityFunded__Params {
  _event: CommunityFunded;

  constructor(event: CommunityFunded) {
    this._event = event;
  }

  get community(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class CommunityMigrated extends ethereum.Event {
  get params(): CommunityMigrated__Params {
    return new CommunityMigrated__Params(this);
  }
}

export class CommunityMigrated__Params {
  _event: CommunityMigrated;

  constructor(event: CommunityMigrated) {
    this._event = event;
  }

  get managers(): Array<Address> {
    return this._event.parameters[0].value.toAddressArray();
  }

  get communityAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get previousCommunityAddress(): Address {
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

  get communityAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class CommunityTemplateUpdated extends ethereum.Event {
  get params(): CommunityTemplateUpdated__Params {
    return new CommunityTemplateUpdated__Params(this);
  }
}

export class CommunityTemplateUpdated__Params {
  _event: CommunityTemplateUpdated;

  constructor(event: CommunityTemplateUpdated) {
    this._event = event;
  }

  get oldCommunityTemplate(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newCommunityTemplate(): Address {
    return this._event.parameters[1].value.toAddress();
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

export class TransferERC20 extends ethereum.Event {
  get params(): TransferERC20__Params {
    return new TransferERC20__Params(this);
  }
}

export class TransferERC20__Params {
  _event: TransferERC20;

  constructor(event: TransferERC20) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TreasuryUpdated extends ethereum.Event {
  get params(): TreasuryUpdated__Params {
    return new TreasuryUpdated__Params(this);
  }
}

export class TreasuryUpdated__Params {
  _event: TreasuryUpdated;

  constructor(event: TreasuryUpdated) {
    this._event = event;
  }

  get oldTreasury(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newTreasury(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class CommunityAdmin extends ethereum.SmartContract {
  static bind(address: Address): CommunityAdmin {
    return new CommunityAdmin("CommunityAdmin", address);
  }

  cUSD(): Address {
    let result = super.call("cUSD", "cUSD():(address)", []);

    return result[0].toAddress();
  }

  try_cUSD(): ethereum.CallResult<Address> {
    let result = super.tryCall("cUSD", "cUSD():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  communities(param0: Address): i32 {
    let result = super.call("communities", "communities(address):(uint8)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toI32();
  }

  try_communities(param0: Address): ethereum.CallResult<i32> {
    let result = super.tryCall("communities", "communities(address):(uint8)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  communityListAt(index: BigInt): Address {
    let result = super.call(
      "communityListAt",
      "communityListAt(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(index)]
    );

    return result[0].toAddress();
  }

  try_communityListAt(index: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "communityListAt",
      "communityListAt(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(index)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  communityListLength(): BigInt {
    let result = super.call(
      "communityListLength",
      "communityListLength():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_communityListLength(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "communityListLength",
      "communityListLength():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  communityProxyAdmin(): Address {
    let result = super.call(
      "communityProxyAdmin",
      "communityProxyAdmin():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_communityProxyAdmin(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "communityProxyAdmin",
      "communityProxyAdmin():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  communityTemplate(): Address {
    let result = super.call(
      "communityTemplate",
      "communityTemplate():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_communityTemplate(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "communityTemplate",
      "communityTemplate():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
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

  treasury(): Address {
    let result = super.call("treasury", "treasury():(address)", []);

    return result[0].toAddress();
  }

  try_treasury(): ethereum.CallResult<Address> {
    let result = super.tryCall("treasury", "treasury():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class AddCommunityCall extends ethereum.Call {
  get inputs(): AddCommunityCall__Inputs {
    return new AddCommunityCall__Inputs(this);
  }

  get outputs(): AddCommunityCall__Outputs {
    return new AddCommunityCall__Outputs(this);
  }
}

export class AddCommunityCall__Inputs {
  _call: AddCommunityCall;

  constructor(call: AddCommunityCall) {
    this._call = call;
  }

  get managers_(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get claimAmount_(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get maxClaim_(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get decreaseStep_(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get baseInterval_(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get incrementInterval_(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get minTranche_(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }

  get maxTranche_(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }
}

export class AddCommunityCall__Outputs {
  _call: AddCommunityCall;

  constructor(call: AddCommunityCall) {
    this._call = call;
  }
}

export class AddManagerToCommunityCall extends ethereum.Call {
  get inputs(): AddManagerToCommunityCall__Inputs {
    return new AddManagerToCommunityCall__Inputs(this);
  }

  get outputs(): AddManagerToCommunityCall__Outputs {
    return new AddManagerToCommunityCall__Outputs(this);
  }
}

export class AddManagerToCommunityCall__Inputs {
  _call: AddManagerToCommunityCall;

  constructor(call: AddManagerToCommunityCall) {
    this._call = call;
  }

  get community_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get account_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class AddManagerToCommunityCall__Outputs {
  _call: AddManagerToCommunityCall;

  constructor(call: AddManagerToCommunityCall) {
    this._call = call;
  }
}

export class FundCommunityCall extends ethereum.Call {
  get inputs(): FundCommunityCall__Inputs {
    return new FundCommunityCall__Inputs(this);
  }

  get outputs(): FundCommunityCall__Outputs {
    return new FundCommunityCall__Outputs(this);
  }
}

export class FundCommunityCall__Inputs {
  _call: FundCommunityCall;

  constructor(call: FundCommunityCall) {
    this._call = call;
  }
}

export class FundCommunityCall__Outputs {
  _call: FundCommunityCall;

  constructor(call: FundCommunityCall) {
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

  get communityTemplate_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get cUSD_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class MigrateCommunityCall extends ethereum.Call {
  get inputs(): MigrateCommunityCall__Inputs {
    return new MigrateCommunityCall__Inputs(this);
  }

  get outputs(): MigrateCommunityCall__Outputs {
    return new MigrateCommunityCall__Outputs(this);
  }
}

export class MigrateCommunityCall__Inputs {
  _call: MigrateCommunityCall;

  constructor(call: MigrateCommunityCall) {
    this._call = call;
  }

  get managers_(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get previousCommunity_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class MigrateCommunityCall__Outputs {
  _call: MigrateCommunityCall;

  constructor(call: MigrateCommunityCall) {
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

  get community_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemoveCommunityCall__Outputs {
  _call: RemoveCommunityCall;

  constructor(call: RemoveCommunityCall) {
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

export class TransferCall extends ethereum.Call {
  get inputs(): TransferCall__Inputs {
    return new TransferCall__Inputs(this);
  }

  get outputs(): TransferCall__Outputs {
    return new TransferCall__Outputs(this);
  }
}

export class TransferCall__Inputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get token_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount_(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferCall__Outputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }
}

export class TransferFromCommunityCall extends ethereum.Call {
  get inputs(): TransferFromCommunityCall__Inputs {
    return new TransferFromCommunityCall__Inputs(this);
  }

  get outputs(): TransferFromCommunityCall__Outputs {
    return new TransferFromCommunityCall__Outputs(this);
  }
}

export class TransferFromCommunityCall__Inputs {
  _call: TransferFromCommunityCall;

  constructor(call: TransferFromCommunityCall) {
    this._call = call;
  }

  get community_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get token_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get to_(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get amount_(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class TransferFromCommunityCall__Outputs {
  _call: TransferFromCommunityCall;

  constructor(call: TransferFromCommunityCall) {
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

export class UpdateBeneficiaryParamsCall extends ethereum.Call {
  get inputs(): UpdateBeneficiaryParamsCall__Inputs {
    return new UpdateBeneficiaryParamsCall__Inputs(this);
  }

  get outputs(): UpdateBeneficiaryParamsCall__Outputs {
    return new UpdateBeneficiaryParamsCall__Outputs(this);
  }
}

export class UpdateBeneficiaryParamsCall__Inputs {
  _call: UpdateBeneficiaryParamsCall;

  constructor(call: UpdateBeneficiaryParamsCall) {
    this._call = call;
  }

  get community_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get claimAmount_(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get maxClaim_(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get decreaseStep_(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get baseInterval_(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get incrementInterval_(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }
}

export class UpdateBeneficiaryParamsCall__Outputs {
  _call: UpdateBeneficiaryParamsCall;

  constructor(call: UpdateBeneficiaryParamsCall) {
    this._call = call;
  }
}

export class UpdateCommunityParamsCall extends ethereum.Call {
  get inputs(): UpdateCommunityParamsCall__Inputs {
    return new UpdateCommunityParamsCall__Inputs(this);
  }

  get outputs(): UpdateCommunityParamsCall__Outputs {
    return new UpdateCommunityParamsCall__Outputs(this);
  }
}

export class UpdateCommunityParamsCall__Inputs {
  _call: UpdateCommunityParamsCall;

  constructor(call: UpdateCommunityParamsCall) {
    this._call = call;
  }

  get community_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get minTranche_(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get maxTranche_(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class UpdateCommunityParamsCall__Outputs {
  _call: UpdateCommunityParamsCall;

  constructor(call: UpdateCommunityParamsCall) {
    this._call = call;
  }
}

export class UpdateCommunityTemplateCall extends ethereum.Call {
  get inputs(): UpdateCommunityTemplateCall__Inputs {
    return new UpdateCommunityTemplateCall__Inputs(this);
  }

  get outputs(): UpdateCommunityTemplateCall__Outputs {
    return new UpdateCommunityTemplateCall__Outputs(this);
  }
}

export class UpdateCommunityTemplateCall__Inputs {
  _call: UpdateCommunityTemplateCall;

  constructor(call: UpdateCommunityTemplateCall) {
    this._call = call;
  }

  get newCommunityTemplate_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpdateCommunityTemplateCall__Outputs {
  _call: UpdateCommunityTemplateCall;

  constructor(call: UpdateCommunityTemplateCall) {
    this._call = call;
  }
}

export class UpdateProxyImplementationCall extends ethereum.Call {
  get inputs(): UpdateProxyImplementationCall__Inputs {
    return new UpdateProxyImplementationCall__Inputs(this);
  }

  get outputs(): UpdateProxyImplementationCall__Outputs {
    return new UpdateProxyImplementationCall__Outputs(this);
  }
}

export class UpdateProxyImplementationCall__Inputs {
  _call: UpdateProxyImplementationCall;

  constructor(call: UpdateProxyImplementationCall) {
    this._call = call;
  }

  get communityProxy_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get newCommunityTemplate_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class UpdateProxyImplementationCall__Outputs {
  _call: UpdateProxyImplementationCall;

  constructor(call: UpdateProxyImplementationCall) {
    this._call = call;
  }
}

export class UpdateTreasuryCall extends ethereum.Call {
  get inputs(): UpdateTreasuryCall__Inputs {
    return new UpdateTreasuryCall__Inputs(this);
  }

  get outputs(): UpdateTreasuryCall__Outputs {
    return new UpdateTreasuryCall__Outputs(this);
  }
}

export class UpdateTreasuryCall__Inputs {
  _call: UpdateTreasuryCall;

  constructor(call: UpdateTreasuryCall) {
    this._call = call;
  }

  get newTreasury_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpdateTreasuryCall__Outputs {
  _call: UpdateTreasuryCall;

  constructor(call: UpdateTreasuryCall) {
    this._call = call;
  }
}
