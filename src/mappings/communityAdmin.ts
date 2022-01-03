import { store } from '@graphprotocol/graph-ts';

import {
    CommunityAdded,
    CommunityMigrated,
    CommunityRemoved,
} from '../../generated/CommunityAdmin/CommunityAdmin';
import { CommunityDailyEntity, CommunityEntity } from '../../generated/schema';
import { Community } from '../../generated/templates';
import {
    generiHandleCommunityAdded,
    generiHandleCommunityRemoved,
} from '../common/community';

export function handleCommunityAdded(event: CommunityAdded): void {
    generiHandleCommunityAdded(
        event.params.communityAddress,
        event.params.claimAmount,
        event.params.maxClaim,
        event.params.decreaseStep,
        event.params.baseInterval.toI32(),
        event.params.incrementInterval.toI32(),
        event.block.timestamp
    );
    // create community entry
    Community.create(event.params.communityAddress);
}

export function handleCommunityRemoved(event: CommunityRemoved): void {
    generiHandleCommunityRemoved(
        event.params.communityAddress,
        event.block.timestamp
    );
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
        // read start day id and update all community daily
        const todayDayId = event.block.timestamp.toI32() / 86400;
        let dayId = previousCommunity.startDayId;
        while (dayId <= todayDayId) {
            const previousCommunityDailyId = `${event.params.previousCommunityAddress.toHex()}-${dayId}`;
            const previousCommunityDaily = CommunityDailyEntity.load(
                previousCommunityDailyId
            );
            if (previousCommunityDaily) {
                const communityDailyId = `${event.params.communityAddress.toHex()}-${dayId}`;
                const communityDaily = new CommunityDailyEntity(
                    communityDailyId
                );
                communityDaily.community =
                    event.params.communityAddress.toHex();
                communityDaily.dayId = previousCommunityDaily.dayId;
                communityDaily.beneficiaries =
                    previousCommunityDaily.beneficiaries;
                communityDaily.managers = previousCommunityDaily.managers;
                communityDaily.contributed = previousCommunityDaily.contributed;
                communityDaily.claimed = previousCommunityDaily.claimed;
                communityDaily.save();
                store.remove('CommunityDailyEntity', previousCommunityDailyId);
            }
            dayId++;
        }
        community.state = previousCommunity.state;
        community.claimAmount = previousCommunity.claimAmount;
        community.maxClaim = previousCommunity.maxClaim;
        community.decreaseStep = previousCommunity.decreaseStep;
        community.baseInterval = previousCommunity.baseInterval;
        community.incrementInterval = previousCommunity.incrementInterval;
        community.beneficiaries = previousCommunity.removedManagers;
        community.removedBeneficiaries = previousCommunity.removedBeneficiaries;
        community.managers = 0;
        community.removedManagers = 0;
        community.contributed = previousCommunity.contributed;
        community.claimed = previousCommunity.claimed;
        community.previous = event.params.previousCommunityAddress;
        // create community entry
        Community.create(event.params.communityAddress);
        // save entity state
        community.save();
    }
}
