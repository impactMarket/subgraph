import { BigInt } from '@graphprotocol/graph-ts';

import {
    CommunityAdded,
    CommunityMigrated,
} from '../../generated/CommunityAdmin/CommunityAdmin';
import { CommunityEntity } from '../../generated/schema';
import { Community } from '../../generated/templates';

export function handleCommunityAdded(event: CommunityAdded): void {
    let community = CommunityEntity.load(event.params.communityAddress.toHex());
    if (!community) {
        community = new CommunityEntity(event.params.communityAddress.toHex());
    }
    community.claimAmount = event.params.claimAmount;
    community.maxClaim = event.params.maxClaim;
    community.decreaseStep = event.params.decreaseStep;
    community.baseInterval = event.params.baseInterval.toI32();
    community.incrementInterval = event.params.incrementInterval.toI32();
    community.totalBeneficiaries = 0;
    community.totalManagers = 0;
    community.totalContributed = BigInt.fromI32(0);
    community.totalClaimed = BigInt.fromI32(0);
    // create community entry
    Community.create(event.params.communityAddress);
    // save entity state
    community.save();
}

export function handleCommunityMigrated(event: CommunityMigrated): void {
    let community = CommunityEntity.load(event.params.communityAddress.toHex());
    if (!community) {
        community = new CommunityEntity(event.params.communityAddress.toHex());
    }
    const previousCommunity = CommunityEntity.load(
        event.params.previousCommunityAddress.toHex()
    );
    if (previousCommunity) {
        community.claimAmount = previousCommunity.claimAmount;
        community.maxClaim = previousCommunity.maxClaim;
        community.decreaseStep = previousCommunity.decreaseStep;
        community.baseInterval = previousCommunity.baseInterval;
        community.incrementInterval = previousCommunity.incrementInterval;
        community.totalBeneficiaries = previousCommunity.totalBeneficiaries;
        community.totalManagers = 0;
        community.totalContributed = previousCommunity.totalContributed;
        community.totalClaimed = previousCommunity.totalClaimed;
        community.previous = event.params.previousCommunityAddress;
        // create community entry
        Community.create(event.params.communityAddress);
        // save entity state
        community.save();
    }
}
