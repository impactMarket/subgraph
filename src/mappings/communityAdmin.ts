import { Address, BigDecimal, BigInt, store } from '@graphprotocol/graph-ts';

import { AssetContributions, CommunityDailyEntity, CommunityEntity, UBIDailyEntity } from '../../generated/schema';
import { Community } from '../../generated/templates';
import {
    CommunityAdded,
    CommunityCopied,
    CommunityMigrated,
    CommunityRemoved
} from '../../generated/CommunityAdmin/CommunityAdmin';
import { generiHandleCommunityAdded, generiHandleCommunityRemoved } from '../common/community';
import { genericHandleManagerAdded } from '../common/manager';
import { loadOrCreateDailyUbi } from '../common/ubi';

export function handleCommunityAdded(event: CommunityAdded): void {
    generiHandleCommunityAdded(
        event.params.communityAddress,
        event.params.managers,
        event.params.originalClaimAmount,
        event.params.maxTotalClaim,
        event.params.decreaseStep,
        event.params.baseInterval.gt(BigInt.fromI32(500000)) ? 0 : event.params.baseInterval.toI32(),
        event.params.incrementInterval.gt(BigInt.fromI32(500000)) ? 0 : event.params.incrementInterval.toI32(),
        event.params.minTranche,
        event.params.maxTranche,
        event.transaction.hash.toHex(),
        event.block.number,
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
        let arrayNext = previousCommunity.next;

        if (!arrayNext) {
            arrayNext = new Array<string>();
        }

        arrayNext.push(event.params.communityAddress.toHex());
        previousCommunity.next = arrayNext;
        // create new community
        community.startDayId = previousCommunity.startDayId;
        community.state = previousCommunity.state;
        community.claimAmount = previousCommunity.claimAmount;
        community.originalClaimAmount = previousCommunity.originalClaimAmount;
        community.maxClaim = previousCommunity.maxClaim;
        community.maxTotalClaim = previousCommunity.maxTotalClaim;
        // 18962 = 1 december 2021
        if (previousCommunity.decreaseStep.equals(BigDecimal.zero()) && previousCommunity.startDayId < 18962) {
            community.decreaseStep = BigDecimal.fromString('0.01');
        } else {
            community.decreaseStep = previousCommunity.decreaseStep;
        }
        community.baseInterval = previousCommunity.baseInterval;
        community.incrementInterval = previousCommunity.incrementInterval;
        community.beneficiaries = previousCommunity.beneficiaries;
        community.maxBeneficiaries = previousCommunity.maxBeneficiaries;
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
        community.previous = event.params.previousCommunityAddress.toHex();
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

export function handleCommunityCopied(event: CommunityCopied): void {
    const originalCommunity = CommunityEntity.load(event.params.originalCommunity.toHex())!;
    const newCommunity = new CommunityEntity(event.params.copyCommunity.toHex());
    const ubi = UBIDailyEntity.load('0')!;
    // update daily ubi
    const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);

    // can't merge because it will override the some null fields
    // newCommunity.merge([originalCommunity]);

    // update previous community
    let arrayNext = originalCommunity.next;

    if (!arrayNext) {
        arrayNext = new Array<string>();
    }

    arrayNext.push(event.params.copyCommunity.toHex());
    originalCommunity.next = arrayNext;

    // new community
    newCommunity.id = event.params.copyCommunity.toHex();
    newCommunity.previous = event.params.originalCommunity.toHex();
    newCommunity.startDayId = event.block.timestamp.toI32() / 86400;
    newCommunity.beneficiaries = 0;
    newCommunity.removedBeneficiaries = 0;
    newCommunity.lockedBeneficiaries = 0;
    newCommunity.managers = 0;
    newCommunity.removedManagers = 0;
    newCommunity.claimed = BigDecimal.zero();
    newCommunity.claims = 0;
    newCommunity.contributed = BigDecimal.zero();
    newCommunity.contributors = 0;
    newCommunity.contributions = new Array<string>();
    newCommunity.managerList = new Array<string>();
    newCommunity.estimatedFunds = BigDecimal.zero();
    newCommunity.lastActivity = event.block.timestamp.toI32();
    // remaining properties are the same
    newCommunity.state = originalCommunity.state;
    // newCommunity.previous = event.params.originalCommunity;
    newCommunity.claimAmount = originalCommunity.claimAmount;
    newCommunity.originalClaimAmount = originalCommunity.originalClaimAmount;
    newCommunity.maxClaim = originalCommunity.maxClaim;
    newCommunity.maxTotalClaim = originalCommunity.maxTotalClaim;
    newCommunity.decreaseStep = originalCommunity.decreaseStep;
    newCommunity.baseInterval = originalCommunity.baseInterval;
    newCommunity.incrementInterval = originalCommunity.incrementInterval;
    newCommunity.maxBeneficiaries = originalCommunity.maxBeneficiaries;
    newCommunity.minTranche = originalCommunity.minTranche;
    newCommunity.maxTranche = originalCommunity.maxTranche;

    ubi.communities += 1;
    ubiDaily.communities += 1;

    originalCommunity.save();
    newCommunity.save();
    ubi.save();
    ubiDaily.save();
}
