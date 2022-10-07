import { Address, BigDecimal } from '@graphprotocol/graph-ts';

import {
    AssetContributions,
    BeneficiaryEntity,
    CommunityDailyEntity,
    CommunityEntity,
    ContributorContributionsEntity,
    ContributorEntity,
    UBIDailyEntity,
    UserTransactionWithEntity,
    UserTransactionsEntity
} from '../../generated/schema';
import { Transfer } from '../../generated/CeloDollar/CeloDollar';
import { attestationProxyAddress, treasuryAddress } from '../common/addresses';
import { loadOrCreateCommunityDaily } from '../common/community';
import { loadOrCreateDailyUbi } from '../common/ubi';
import { normalize } from '../utils';

function updateContributorHelper(
    event: Transfer,
    normalizedAmount: BigDecimal,
    dayId: i32,
    ubi: UBIDailyEntity,
    ubiDaily: UBIDailyEntity
): void {
    // update contribuotrs data
    let contributor = ContributorEntity.load(event.params.from.toHex());

    if (!contributor) {
        contributor = new ContributorEntity(event.params.from.toHex());
        contributor.contributed = BigDecimal.zero();
        contributor.contributions = 0;
        contributor.lastContribution = dayId;
        // update ubi data
        if (event.params.from.notEqual(Address.fromString(treasuryAddress))) {
            ubi.contributors += 1;
            ubiDaily.contributors += 1;
        }
    } else if (
        contributor.lastContribution != dayId &&
        event.params.from.notEqual(Address.fromString(treasuryAddress))
    ) {
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
    community: CommunityEntity | null,
    communityDaily: CommunityDailyEntity | null
): void {
    // update contribuotrs data for community
    const contributorContributionsId = `${event.params.from.toHex()}-${event.params.to.toHex()}`;
    let contributorContributions = ContributorContributionsEntity.load(contributorContributionsId);

    if (!contributorContributions) {
        contributorContributions = new ContributorContributionsEntity(contributorContributionsId);
        contributorContributions.to = event.params.to;
        contributorContributions.contributed = BigDecimal.zero();
        contributorContributions.contributions = 0;
        contributorContributions.lastContribution = dayId;
        // update ubi data
        if (community) {
            community.contributors += 1;
        }
        if (communityDaily) {
            communityDaily.contributors += 1;
        }
    }
    if (communityDaily && contributorContributions.lastContribution !== dayId) {
        communityDaily.contributors += 1;
    }
    contributorContributions.contributed = contributorContributions.contributed.plus(normalizedAmount);
    contributorContributions.contributions += 1;
    contributorContributions.lastContribution = dayId;
    contributorContributions.save();
}

export function handleTransferAsset(event: Transfer): void {
    // because this is executed for every transfer, performance is very important
    if (event.params.to.equals(Address.fromString(treasuryAddress))) {
        const dayId = event.block.timestamp.toI32() / 86400;
        const normalizedAmount = normalize(event.params.amount.toString());
        const ubi = UBIDailyEntity.load('0')!;
        const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);
        const asset = event.address;
        const contributionDailyId = `${asset.toHex()}-${dayId.toString()}`;
        let contributionDaily = AssetContributions.load(contributionDailyId);

        ubi.contributed = ubi.contributed.plus(normalizedAmount);
        // TODO: next line is deprecated
        ubiDaily.contributed = ubiDaily.contributed.plus(normalizedAmount);


        // update communty daily contribution
        if (contributionDaily) {
            // add if exists
            contributionDaily.amount = contributionDaily.amount.plus(normalizedAmount);
        } else {
            // if it doesn't, create and add to the list
            const contributionsDaily = ubiDaily.contributions;

            contributionDaily = new AssetContributions(contributionDailyId);
            contributionDaily.asset = asset;
            contributionDaily.amount = normalizedAmount;
            contributionsDaily.push(contributionDaily.id);

            ubiDaily.contributions = contributionsDaily;
        }
        contributionDaily.save();

        updateContributorHelper(event, normalizedAmount, dayId, ubi, ubiDaily);
        updateContributorContributionsHelper(event, normalizedAmount, dayId, null, null);

        ubi.save();
        ubiDaily.save();
    } else if (CommunityEntity.load(event.params.to.toHex())) {
        const dayId = event.block.timestamp.toI32() / 86400;
        const normalizedAmount = normalize(event.params.amount.toString());
        const community = CommunityEntity.load(event.params.to.toHex())!;
        const communityDaily = loadOrCreateCommunityDaily(event.params.to, event.block.timestamp);
        const ubi = UBIDailyEntity.load('0')!;
        const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);
        const asset = event.address;
        const to = event.params.to;
        const contributionCommunityId = `${asset.toHex()}-${to.toHex()}`;
        const contributionCommunityDailyId = `${asset.toHex()}-${to.toHex()}-${dayId.toString()}`;
        const contributionDailyId = `${asset.toHex()}-${dayId.toString()}`;
        let contributionCommunity = AssetContributions.load(contributionCommunityId);
        let contributionCommunityDaily = AssetContributions.load(contributionCommunityDailyId);
        let contributionDaily = AssetContributions.load(contributionDailyId);

        updateContributorHelper(event, normalizedAmount, dayId, ubi, ubiDaily);
        updateContributorContributionsHelper(event, normalizedAmount, dayId, community, communityDaily);

        if (event.params.from.notEqual(Address.fromString(treasuryAddress))) {
            ubi.contributed = ubi.contributed.plus(normalizedAmount);
            // TODO: next line is deprecated
            ubiDaily.contributed = ubiDaily.contributed.plus(normalizedAmount);


            // update communty daily contribution
            if (contributionDaily) {
                // add if exists
                contributionDaily.amount = contributionDaily.amount.plus(normalizedAmount);
            } else {
                // if it doesn't, create and add to the list
                const contributionsDaily = ubiDaily.contributions;

                contributionDaily = new AssetContributions(contributionDailyId);
                contributionDaily.asset = asset;
                contributionDaily.amount = normalizedAmount;
                contributionsDaily.push(contributionDaily.id);

                ubiDaily.contributions = contributionsDaily;
            }
            contributionDaily.save();
        }
        ubi.save();
        ubiDaily.save();
        // update community contribution
        if (contributionCommunity) {
            // add if exists
            contributionCommunity.amount = contributionCommunity.amount.plus(normalizedAmount);
        } else {
            // if it doesn't, create and add to the list
            const contributions = community.contributions;

            contributionCommunity = new AssetContributions(contributionCommunityId);
            contributionCommunity.asset = asset;
            contributionCommunity.amount = normalizedAmount;

            contributions.push(contributionCommunity.id);
            community.contributions = contributions;
        }
        // update communty daily contribution
        if (contributionCommunityDaily) {
            // add if exists
            contributionCommunityDaily.amount = contributionCommunityDaily.amount.plus(normalizedAmount);
        } else {
            // if it doesn't, create and add to the list
            const contributionsCommunityDaily = communityDaily.contributions;

            contributionCommunityDaily = new AssetContributions(contributionCommunityDailyId);
            contributionCommunityDaily.asset = asset;
            contributionCommunityDaily.amount = normalizedAmount;
            contributionsCommunityDaily.push(contributionCommunityDaily.id);

            communityDaily.contributions = contributionsCommunityDaily;
        }
        // update contribution
        contributionCommunity.save();
        contributionCommunityDaily.save();
        // update community
        community.contributed = community.contributed.plus(normalizedAmount);
        community.estimatedFunds = community.estimatedFunds.plus(normalizedAmount);
        community.save();
        // update community daily
        communityDaily.contributed = communityDaily.contributed.plus(normalizedAmount);
        communityDaily.save();
    } else if (
        // do not count from communities [eg. claims]
        !CommunityEntity.load(event.params.from.toHex()) &&
        // beneficiary in public community (both from or to)
        (BeneficiaryEntity.load(event.params.from.toHex()) || BeneficiaryEntity.load(event.params.to.toHex())) &&
        // ignore AttestationProxy
        event.params.to.notEqual(Address.fromString(attestationProxyAddress)) &&
        // yeah, people without knowing make transactions to themselves! 🕊️
        event.params.from.notEqual(event.params.to) &&
        // any values >0.0009cUSD (999999999999999) [eg. cUSD fees]
        event.params.amount.toString().length > 15
    ) {
        const dayId = event.block.timestamp.toI32() / 86400;
        const normalizedAmount = normalize(event.params.amount.toString());
        let beneficiary = BeneficiaryEntity.load(event.params.from.toHex());

        if (!beneficiary) {
            beneficiary = BeneficiaryEntity.load(event.params.to.toHex());
        }
        const communityDaily = loadOrCreateCommunityDaily(
            Address.fromString(beneficiary!.community),
            event.block.timestamp
        );
        const ubi = UBIDailyEntity.load('0')!;
        const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);

        let transactionFrom = UserTransactionsEntity.load(event.params.from.toHex());
        let transactionTo = UserTransactionsEntity.load(event.params.to.toHex());
        const transactionWithId = `${event.params.from.toHex()}-${event.params.to.toHex()}`;
        let transactionWith = UserTransactionWithEntity.load(transactionWithId);

        if (!transactionFrom || !transactionTo) {
            ubi.reach += 1;
            ubiDaily.reach += 1;
            communityDaily.reach += 1;
        } else if (
            transactionFrom &&
            transactionTo &&
            (!transactionWith || (transactionWith && transactionWith.lastTransaction !== dayId))
        ) {
            ubiDaily.reach += 1;
            communityDaily.reach += 1;
        }

        if (!transactionFrom) {
            transactionFrom = new UserTransactionsEntity(event.params.from.toHex());
            transactionFrom.volume = BigDecimal.zero();
            transactionFrom.transactions = 0;
        }
        if (!transactionTo) {
            transactionTo = new UserTransactionsEntity(event.params.to.toHex());
            transactionTo.volume = BigDecimal.zero();
            transactionTo.transactions = 0;
        }
        if (!transactionWith) {
            transactionWith = new UserTransactionWithEntity(transactionWithId);
        }
        transactionFrom.volume = transactionFrom.volume.plus(normalizedAmount);
        transactionFrom.transactions += 1;
        transactionTo.volume = transactionTo.volume.plus(normalizedAmount);
        transactionTo.transactions += 1;
        transactionWith.lastTransaction = dayId;

        ubi.volume = ubi.volume.plus(normalizedAmount);
        ubi.transactions += 1;
        ubiDaily.volume = ubiDaily.volume.plus(normalizedAmount);
        ubiDaily.transactions += 1;
        communityDaily.volume = communityDaily.volume.plus(normalizedAmount);
        communityDaily.transactions += 1;

        transactionFrom.save();
        transactionTo.save();
        transactionWith.save();
        ubi.save();
        ubiDaily.save();
        communityDaily.save();
    }
    // nothing goes here!
}
