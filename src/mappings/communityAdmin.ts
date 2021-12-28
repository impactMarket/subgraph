import {
    CommunityAdded,
    CommunityMigrated,
} from '../../generated/CommunityAdmin/CommunityAdmin';
import { CommunityEntity } from '../../generated/schema';
import { Community } from '../../generated/templates';
import { generiHandleCommunityAdded } from '../common/community';

export function handleCommunityAdded(event: CommunityAdded): void {
    generiHandleCommunityAdded(
        event.params.communityAddress,
        event.params.claimAmount,
        event.params.maxClaim,
        event.params.decreaseStep,
        event.params.baseInterval.toI32(),
        event.params.incrementInterval.toI32()
    );
    // create community entry
    Community.create(event.params.communityAddress);
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
