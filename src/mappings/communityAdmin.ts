import { Address, BigDecimal, BigInt, store } from '@graphprotocol/graph-ts';

import {
    AssetContributions,
    CommunityDailyEntity,
    CommunityEntity,
    UBIDailyEntity
} from '../../generated/schema';
import { Community } from '../../generated/templates';
import { CommunityAdded, CommunityMigrated, CommunityRemoved } from '../../generated/CommunityAdmin/CommunityAdmin';
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
        event.params.baseInterval.gt(BigInt.fromI32(500000)) ? 0 : event.params.baseInterval.toI32(),
        event.params.incrementInterval.gt(BigInt.fromI32(500000)) ? 0 : event.params.incrementInterval.toI32(),
        event.params.minTranche,
        event.params.maxTranche,
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
        community.contributions = new Array<string>();
    }
    const previousCommunity = CommunityEntity.load(event.params.previousCommunityAddress.toHex());

    if (previousCommunity) {
        // read start day id and update all community daily
        const todayDayId = event.block.timestamp.toI32() / 86400;
        let dayId = previousCommunity.startDayId;

        // migrate existing daily states
        // this is necessary given the address is different
        // TODO: test
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
                communityDaily.claims = previousCommunityDaily.claims;
                communityDaily.contributed = previousCommunityDaily.contributed;
                communityDaily.contributors = previousCommunityDaily.contributors;
                communityDaily.contributions = previousCommunityDaily.contributions;
                communityDaily.volume = previousCommunityDaily.volume;
                communityDaily.transactions = previousCommunityDaily.transactions;
                communityDaily.reach = previousCommunityDaily.reach;
                communityDaily.fundingRate = previousCommunityDaily.fundingRate;
                communityDaily.save();
                store.remove('CommunityDailyEntity', previousCommunityDailyId);
            }
            dayId++;
        }
        // migrate existing contributions
        // this is necessary given the address is different
        // TODO: test
        for (let index = 0; index < previousCommunity.contributions.length; index++) {
            const pastContributionId = previousCommunity.contributions[index];
            const pastAssetContributions = AssetContributions.load(pastContributionId)!;
            const assetContributionsId = `${pastContributionId.slice(
                0,
                pastContributionId.indexOf('-')
            )}-${event.params.communityAddress.toHex()}`;

            const assetContributions = new AssetContributions(assetContributionsId);

            assetContributions.asset = pastAssetContributions.asset;
            assetContributions.amount = pastAssetContributions.amount;
            assetContributions.save();
            const contributions = community.contributions;

            contributions.push(assetContributionsId);
            community.contributions = contributions;
            store.remove('AssetContributions', pastContributionId);
        }
        const totalNewManagers = event.params.managers.length;

        // update previous community
        previousCommunity.migrated = event.params.communityAddress;
        // create new community
        community.startDayId = previousCommunity.startDayId;
        community.state = previousCommunity.state;
        community.claimAmount = previousCommunity.claimAmount;
        community.maxClaim = previousCommunity.maxClaim;
        // 18962 = 1 december 2021
        if (previousCommunity.decreaseStep.equals(BigDecimal.zero()) && previousCommunity.startDayId < 18962) {
            community.decreaseStep = BigDecimal.fromString('0.01');
        } else {
            community.decreaseStep = previousCommunity.decreaseStep;
        }
        community.baseInterval = previousCommunity.baseInterval;
        community.incrementInterval = previousCommunity.incrementInterval;
        community.beneficiaries = previousCommunity.beneficiaries;
        community.removedBeneficiaries = previousCommunity.removedBeneficiaries;
        community.managers = totalNewManagers;
        community.removedManagers = previousCommunity.removedManagers;
        community.lockedBeneficiaries = previousCommunity.lockedBeneficiaries;
        community.claims = previousCommunity.claims;
        community.claimed = previousCommunity.claimed;
        community.contributed = previousCommunity.contributed;
        community.contributors = previousCommunity.contributors;
        community.contributions = previousCommunity.contributions;
        community.estimatedFunds = BigDecimal.zero();
        community.previous = event.params.previousCommunityAddress;
        community.managerList = new Array<string>();
        community.minTranche = previousCommunity.minTranche;
        community.maxTranche = previousCommunity.maxTranche;
        previousCommunity.state = 1;
        // create community entry
        Community.create(event.params.communityAddress);

        let decreaseManagers = 0;

        for (let index = 0; index < previousCommunity.managerList.length; index++) {
            const manager = previousCommunity.managerList[index];

            if (!event.params.managers.includes(Address.fromString(manager))) {
                decreaseManagers++;
            }
        }
        for (let index = 0; index < event.params.managers.length; index++) {
            const manager = event.params.managers[index];

            // verify past managers
            if (
                previousCommunity &&
                previousCommunity.managerList &&
                previousCommunity.managerList.length > 0 &&
                previousCommunity.managerList.includes(manager.toHex()) &&
                !event.params.managers.includes(manager)
            ) {
                decreaseManagers++;
            }

            genericHandleManagerAdded(
                community,
                manager,
                event.params.communityAddress,
                event.transaction.hash.toString(),
                event.block.timestamp
            );
        }
        const ubi = UBIDailyEntity.load('0')!;
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
