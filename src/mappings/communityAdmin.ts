import { store } from '@graphprotocol/graph-ts';

import { Community } from '../../generated/templates';
import { CommunityAdded, CommunityMigrated, CommunityRemoved } from '../../generated/CommunityAdmin/CommunityAdmin';
import {
    CommunityDailyEntity,
    CommunityEntity,
    ContributorContributionsEntity,
    UBIEntity
} from '../../generated/schema';
import { generiHandleCommunityAdded, generiHandleCommunityRemoved } from '../common/community';
import { genericHandleManagerAdded } from '../common/manager';
import { loadOrCreateDailyUbi } from '../common/ubi';

export function handleCommunityAdded(event: CommunityAdded): void {
    generiHandleCommunityAdded(
        event.params.communityAddress,
        event.params.managers,
        event.params.claimAmount,
        event.params.maxClaim,
        event.params.decreaseStep,
        event.params.baseInterval.toI32(),
        event.params.incrementInterval.toI32(),
        event.transaction.hash.toHex(),
        event.block.timestamp,
        true
    );

    // create community entry
    Community.create(event.params.communityAddress);
}

export function handleCommunityRemoved(event: CommunityRemoved): void {
    generiHandleCommunityRemoved(event.params.communityAddress, event.block.timestamp);
}

export function handleCommunityMigrated(event: CommunityMigrated): void {
    let community = CommunityEntity.load(event.params.communityAddress.toHex());

    if (!community) {
        community = new CommunityEntity(event.params.communityAddress.toHex());
    }
    const previousCommunity = CommunityEntity.load(event.params.previousCommunityAddress.toHex());

    if (previousCommunity) {
        // read start day id and update all community daily
        const todayDayId = event.block.timestamp.toI32() / 86400;
        let dayId = previousCommunity.startDayId;

        while (dayId <= todayDayId) {
            const previousCommunityDailyId = `${event.params.previousCommunityAddress.toHex()}-${dayId}`;
            const previousCommunityDaily = CommunityDailyEntity.load(previousCommunityDailyId);

            if (previousCommunityDaily) {
                const communityDailyId = `${event.params.communityAddress.toHex()}-${dayId}`;
                const communityDaily = new CommunityDailyEntity(communityDailyId);

                communityDaily.community = event.params.communityAddress.toHex();
                communityDaily.dayId = previousCommunityDaily.dayId;
                communityDaily.beneficiaries = previousCommunityDaily.beneficiaries;
                communityDaily.managers = previousCommunityDaily.managers;
                communityDaily.claimed = previousCommunityDaily.claimed;
                communityDaily.contributed = previousCommunityDaily.contributed;
                communityDaily.contributors = previousCommunityDaily.contributors;
                communityDaily.volume = previousCommunityDaily.volume;
                communityDaily.transactions = previousCommunityDaily.transactions;
                communityDaily.reach = previousCommunityDaily.reach;
                communityDaily.save();
                store.remove('CommunityDailyEntity', previousCommunityDailyId);
            }
            dayId++;
        }
        for (let index = 0; index < community.contributions.length; index++) {
            const pastContributionId = community.contributions[index];
            const pastContributorContributions = ContributorContributionsEntity.load(pastContributionId)!;
            const contributorContributionsId = `${pastContributionId.slice(
                0,
                pastContributionId.indexOf('-')
            )}-${event.params.communityAddress.toHex()}`;

            const contributorContributions = new ContributorContributionsEntity(contributorContributionsId);

            contributorContributions.to = pastContributorContributions.to;
            contributorContributions.contributed = pastContributorContributions.contributed;
            contributorContributions.contributions = pastContributorContributions.contributions;
            contributorContributions.lastContribution = pastContributorContributions.lastContribution;
            contributorContributions.save();
            const contributions = community.contributions;

            contributions.push(contributorContributionsId);
            community.contributions = contributions;
            store.remove('ContributorContributionsEntity', pastContributionId);
        }
        const totalNewManagers = event.params.managers.length;

        // update previous community
        previousCommunity.migrated = event.params.communityAddress;
        // create new community
        community.startDayId = previousCommunity.startDayId;
        community.state = previousCommunity.state;
        community.claimAmount = previousCommunity.claimAmount;
        community.maxClaim = previousCommunity.maxClaim;
        community.decreaseStep = previousCommunity.decreaseStep;
        community.baseInterval = previousCommunity.baseInterval;
        community.incrementInterval = previousCommunity.incrementInterval;
        community.beneficiaries = previousCommunity.beneficiaries;
        community.removedBeneficiaries = previousCommunity.removedBeneficiaries;
        community.managers = totalNewManagers;
        community.removedManagers = previousCommunity.removedManagers;
        community.claims = previousCommunity.claims;
        community.claimed = previousCommunity.claimed;
        community.contributed = previousCommunity.contributed;
        community.contributors = previousCommunity.contributors;
        community.previous = event.params.previousCommunityAddress;
        community.managerList = new Array<string>();
        previousCommunity.state = 1;
        // create community entry
        Community.create(event.params.communityAddress);

        let decreaseManagers = 0;

        for (let index = 0; index < event.params.managers.length; index++) {
            const manager = event.params.managers[index];

            // verify past managers
            if (
                previousCommunity &&
                previousCommunity.managerList &&
                previousCommunity.managerList.length > 0 &&
                previousCommunity.managerList.includes(manager.toHex())
            ) {
                decreaseManagers += 1;
            }

            genericHandleManagerAdded(
                community,
                manager,
                event.params.communityAddress,
                event.transaction.hash.toString(),
                event.block.timestamp
            );
        }
        const ubi = UBIEntity.load('0')!;
        const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);

        // save entity state
        ubi.managers -= decreaseManagers;
        community.managers -= decreaseManagers;
        ubiDaily.managers -= decreaseManagers;
        ubi.save();
        ubiDaily.save();
        community.save();
        previousCommunity.save();
    }
}
