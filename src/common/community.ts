import { Address, BigInt } from '@graphprotocol/graph-ts';

import { CommunityDailyEntity, CommunityEntity } from '../../generated/schema';

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
    _incrementInterval: i32
): void {
    const communityId = _communityAddress.toHex();
    let community = CommunityEntity.load(communityId);
    if (!community) {
        community = new CommunityEntity(communityId);
    }
    community.claimAmount = _claimAmount;
    community.maxClaim = _maxClaim;
    community.decreaseStep = _decreaseStep;
    community.baseInterval = _baseInterval;
    community.incrementInterval = _incrementInterval;
    community.totalBeneficiaries = 0;
    community.totalManagers = 0;
    community.totalContributed = BigInt.fromI32(0);
    community.totalClaimed = BigInt.fromI32(0);
    community.save();
}
