import { BigInt } from '@graphprotocol/graph-ts';

import { CommunityAdded as OldCommunityAdded } from '../../../generated/OldImpactMarket/OldImpactMarket';
import { OldCommunity } from '../../../generated/templates';
import { generiHandleCommunityAdded } from '../../common/community';

export function handleOldCommunityAdded(event: OldCommunityAdded): void {
    generiHandleCommunityAdded(
        event.params._communityAddress,
        event.params._claimAmount,
        event.params._maxClaim,
        BigInt.fromI32(0),
        event.params._baseInterval.toI32(),
        event.params._incrementInterval.toI32()
    );
    // create community entry
    OldCommunity.create(event.params._communityAddress);
}
