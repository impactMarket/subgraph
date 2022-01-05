import { Address, BigInt } from '@graphprotocol/graph-ts';

import {
    CommunityDailyEntity,
    CommunityEntity,
    UBIEntity,
} from '../../generated/schema';
import { loadOrCreateDailyUbi } from './ubi';

export function loadOrCreateCommunityDaily(
    _community: Address,
    _blockTimestamp: BigInt
): CommunityDailyEntity {
    // load or create community daily
    const dayId = _blockTimestamp.toI32() / 86400;
    const communityDailyId = `${_community.toHex()}-${dayId}`;
    let communityDaily = CommunityDailyEntity.load(communityDailyId);
    if (!communityDaily) {
        communityDaily = new CommunityDailyEntity(communityDailyId);
        communityDaily.community = _community.toHex();
        communityDaily.dayId = dayId;
        communityDaily.beneficiaries = 0;
        communityDaily.managers = 0;
        communityDaily.contributed = BigInt.fromI32(0);
        communityDaily.claimed = BigInt.fromI32(0);
    }
    return communityDaily;
}

export function generiHandleCommunityAdded(
    _communityAddress: Address,
    _claimAmount: BigInt,
    _maxClaim: BigInt,
    _decreaseStep: BigInt,
    _baseInterval: i32,
    _incrementInterval: i32,
    _blockTimestamp: BigInt
): void {
    const communityId = _communityAddress.toHex();
    let community = CommunityEntity.load(communityId);
    if (!community) {
        community = new CommunityEntity(communityId);
    }
    community.state = 0;
    community.startDayId = _blockTimestamp.toI32() / 86400;
    community.claimAmount = _claimAmount;
    community.maxClaim = _maxClaim;
    community.decreaseStep = _decreaseStep;
    community.baseInterval = _baseInterval;
    community.incrementInterval = _incrementInterval;
    community.beneficiaries = 0;
    community.removedBeneficiaries = 0;
    community.managers = 0;
    community.removedManagers = 0;
    community.contributed = BigInt.fromI32(0);
    community.claimed = BigInt.fromI32(0);
    community.save();
    // create ubi if it doesn't exist
    const ubi = UBIEntity.load('0');
    if (!ubi) {
        const ubiEntity = new UBIEntity('0');
        ubiEntity.communities = 1; // one already!
        ubiEntity.beneficiaries = 0;
        ubiEntity.managers = 0;
        ubiEntity.contributed = BigInt.fromI32(0);
        ubiEntity.claimed = BigInt.fromI32(0);
        ubiEntity.save();
    }
    // update daily ubi
    const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);
    ubiDaily.communities += 1;
    ubiDaily.save();
}

export function generiHandleCommunityRemoved(
    _communityAddress: Address,
    _blockTimestamp: BigInt
): void {
    const communityId = _communityAddress.toHex();
    let community = CommunityEntity.load(communityId);
    if (!community) {
        community = new CommunityEntity(communityId);
    }
    community.state = 1;
    community.save();
    // update ubi
    const ubi = UBIEntity.load('0')!;
    ubi.communities -= 1;
    ubi.beneficiaries -= community.beneficiaries;
    ubi.save();
    // update daily ubi
    const ubiDaily = loadOrCreateDailyUbi(_blockTimestamp);
    ubiDaily.communities -= 1;
    ubiDaily.beneficiaries -= community.beneficiaries;
    ubiDaily.save();
}
