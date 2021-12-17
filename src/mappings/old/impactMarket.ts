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
    // create community entry
    OldCommunity.create(event.params._communityAddress);
    // save entity state
    community.save();
}
