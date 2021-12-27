import { Address, BigInt } from '@graphprotocol/graph-ts';

import { CommunityDailyEntity } from '../../generated/schema';

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
