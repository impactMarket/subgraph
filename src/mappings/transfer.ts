import { Address, BigDecimal } from '@graphprotocol/graph-ts';

import {
    CommunityDailyEntity,
    CommunityEntity,
    ContributorContributionsEntity,
    ContributorEntity,
    UBIDailyEntity,
    UBIEntity
} from '../../generated/schema';
import { Transfer } from '../../generated/CeloDollar/CeloDollar';
import { loadOrCreateCommunityDaily } from '../common/community';
import { loadOrCreateDailyUbi } from '../common/ubi';
import { normalize } from '../utils';
import { treasuryAddress } from '../common/addresses';

function updateContributorHelper(
    event: Transfer,
    normalizedAmount: BigDecimal,
    dayId: i32,
    ubi: UBIEntity,
    ubiDaily: UBIDailyEntity,
    community: CommunityEntity | null,
    communityDaily: CommunityDailyEntity | null
): void {
    // update contribuotrs data
    let contributor = ContributorEntity.load(event.params.from.toHex());

    if (!contributor) {
        contributor = new ContributorEntity(event.params.from.toHex());
        contributor.contributed = normalizedAmount;
        contributor.contributions = 1;
        contributor.lastContribution = dayId;
        // update ubi data
        ubi.contributors += 1;
        ubiDaily.contributors += 1;
        if (community) {
            community.contributors += 1;
        }
        if (communityDaily) {
            communityDaily.contributors += 1;
        }
    } else if (contributor.lastContribution != dayId) {
        ubiDaily.contributors += 1;
    }
    contributor.contributed = contributor.contributed.plus(normalizedAmount);
    contributor.contributions += 1;
    contributor.lastContribution = dayId;
    contributor.save();
}

function updateContributorContributionsHelper(
    event: Transfer,
    normalizedAmount: BigDecimal,
    dayId: i32,
    ubi: UBIEntity,
    ubiDaily: UBIDailyEntity,
    community: CommunityEntity | null,
    communityDaily: CommunityDailyEntity | null
): void {
    // update contribuotrs data for community
    const contributorContributionsId = `${event.params.from.toHex()}-${event.params.to.toHex()}`;
    let contributorContributions = ContributorContributionsEntity.load(
        contributorContributionsId
    );

    if (!contributorContributions) {
        contributorContributions = new ContributorContributionsEntity(
            contributorContributionsId
        );
        contributorContributions.to = event.params.to;
        contributorContributions.contributed = normalizedAmount;
        contributorContributions.contributions = 1;
        contributorContributions.lastContribution = dayId;
        // update ubi data
        ubi.contributors += 1;
        ubiDaily.contributors += 1;
        if (community) {
            community.contributors += 1;
        }
        if (communityDaily) {
            communityDaily.contributors += 1;
        }
    } else if (contributorContributions.lastContribution != dayId) {
        ubiDaily.contributors += 1;
    }
    contributorContributions.contributed =
        contributorContributions.contributed.plus(normalizedAmount);
    contributorContributions.contributions += 1;
    contributorContributions.lastContribution = dayId;
    contributorContributions.save();
}

export function handleTransferCeloDollar(event: Transfer): void {
    const community = CommunityEntity.load(event.params.to.toHex());
    const dayId = event.block.timestamp.toI32() / 86400;

    if (community) {
        const normalizedAmount = normalize(event.params.amount.toString());
        const communityDaily = loadOrCreateCommunityDaily(
            event.params.to,
            event.block.timestamp
        );
        const ubi = UBIEntity.load('0')!;
        const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);

        updateContributorHelper(
            event,
            normalizedAmount,
            dayId,
            ubi,
            ubiDaily,
            community,
            communityDaily
        );
        updateContributorContributionsHelper(
            event,
            normalizedAmount,
            dayId,
            ubi,
            ubiDaily,
            community,
            communityDaily
        );

        if (event.params.from.notEqual(Address.fromString(treasuryAddress))) {
            ubi.contributed = ubi.contributed.plus(normalizedAmount);
            ubiDaily.contributed = ubiDaily.contributed.plus(normalizedAmount);
        }
        ubi.save();
        ubiDaily.save();
        // update community
        community.contributed = community.contributed.plus(normalizedAmount);
        community.save();
        // update community daily
        communityDaily.contributed =
            communityDaily.contributed.plus(normalizedAmount);
        communityDaily.save();
    } else if (event.params.to.equals(Address.fromString(treasuryAddress))) {
        const normalizedAmount = normalize(event.params.amount.toString());
        const ubi = UBIEntity.load('0')!;
        const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);

        ubi.contributed = ubi.contributed.plus(normalizedAmount);
        ubiDaily.contributed = ubiDaily.contributed.plus(normalizedAmount);

        updateContributorHelper(
            event,
            normalizedAmount,
            dayId,
            ubi,
            ubiDaily,
            null,
            null
        );
        updateContributorContributionsHelper(
            event,
            normalizedAmount,
            dayId,
            ubi,
            ubiDaily,
            null,
            null
        );

        ubi.save();
        ubiDaily.save();
    }
    // nothing goes here!
}
