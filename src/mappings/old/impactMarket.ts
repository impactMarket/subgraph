import { BigInt } from '@graphprotocol/graph-ts';

import { OldCommunity } from '../../../generated/templates';
import {
    CommunityAdded as OldCommunityAdded,
    CommunityRemoved as OldCommunityRemoved
} from '../../../generated/OldImpactMarket/OldImpactMarket';
import { generiHandleCommunityAdded, generiHandleCommunityRemoved } from '../../common/community';

export function handleOldCommunityAdded(event: OldCommunityAdded): void {
    generiHandleCommunityAdded(
        event.params._communityAddress,
        [event.params._firstManager],
        event.params._claimAmount,
        event.params._maxClaim,
        BigInt.fromI32(0),
        event.params._baseInterval.toI32(),
        event.params._incrementInterval.toI32(),
        event.transaction.hash.toHex(),
        event.block.timestamp
    );
    // create community entry
    OldCommunity.create(event.params._communityAddress);
}

export function handleOldCommunityRemoved(event: OldCommunityRemoved): void {
    generiHandleCommunityRemoved(event.params._communityAddress, event.block.timestamp);
}
