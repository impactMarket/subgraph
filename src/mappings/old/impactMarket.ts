import { BigInt } from '@graphprotocol/graph-ts';

import { CommunityAdded as OldCommunityAdded } from '../../../generated/OldImpactMarket/OldImpactMarket';
import { CommunityEntity } from '../../../generated/schema';
import { OldCommunity } from '../../../generated/templates';

export function handleOldCommunityAdded(event: OldCommunityAdded): void {
    let community = CommunityEntity.load(
        event.params._communityAddress.toHex()
    );
    if (!community) {
        community = new CommunityEntity(event.params._communityAddress.toHex());
    }
    community.claimAmount = event.params._claimAmount;
    community.maxClaim = event.params._maxClaim;
    community.decreaseStep = new BigInt(0);
    community.baseInterval = event.params._baseInterval.toI32();
    community.incrementInterval = event.params._incrementInterval.toI32();
    community.totalBeneficiaries = 0;
    community.totalManagers = 0;
    community.totalContributed = BigInt.fromI32(0);
    community.totalClaimed = BigInt.fromI32(0);
    community.managers = [];
    community.beneficiaries = [];
    community.claims = [];
    // create community entry
    OldCommunity.create(event.params._communityAddress);
    // save entity state
    community.save();
}
