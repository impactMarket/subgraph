import { Address, BigDecimal } from '@graphprotocol/graph-ts';

import {
    BeneficiaryEntity,
    CommunityDailyEntity,
    CommunityEntity,
    ContributorContributionsEntity,
    ContributorEntity,
    UBIDailyEntity,
    UBIEntity,
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
    ubi: UBIEntity,
    ubiDaily: UBIDailyEntity,
    community: CommunityEntity | null,
    communityDaily: CommunityDailyEntity | null
): void {
    // update contribuotrs data
    let contributor = ContributorEntity.load(event.params.from.toHex());

    if (!contributor) {
        contributor = new ContributorEntity(event.params.from.toHex());
        contributor.contributed = BigDecimal.zero();
        contributor.contributions = 0;
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
        contributorContributions.contributed = BigDecimal.zero();
        contributorContributions.contributions = 0;
        contributorContributions.lastContribution = dayId;
        // update ubi data
        ubi.contributors += 1;
        ubiDaily.contributors += 1;
        if (community) {
            community.contributors += 1;
            const contributions = community.contributions;

            contributions.push(contributorContributionsId);
            community.contributions = contributions;
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
    const normalizedAmount = normalize(event.params.amount.toString());

    if (community) {
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
    } else if (
        // do not count from communities [eg. claims]
        !CommunityEntity.load(event.params.from.toHex()) &&
        // beneficiary in public community (both from or to)
        (BeneficiaryEntity.load(event.params.from.toHex()) ||
            BeneficiaryEntity.load(event.params.to.toHex())) &&
        // ignore AttestationProxy
        event.params.to.notEqual(Address.fromString(attestationProxyAddress)) &&
        // yeah, people without knowing make transactions to themselves! 🕊️
        event.params.from.notEqual(event.params.to) &&
        // any values >0.0009cUSD (999999999999999) [eg. cUSD fees]
        event.params.amount.toString().length > 15
    ) {
        let beneficiary = BeneficiaryEntity.load(event.params.from.toHex());

        if (!beneficiary) {
            beneficiary = BeneficiaryEntity.load(event.params.to.toHex());
        }
        const communityDaily = loadOrCreateCommunityDaily(
            Address.fromString(beneficiary!.community),
            event.block.timestamp
        );
        const ubi = UBIEntity.load('0')!;
        const ubiDaily = loadOrCreateDailyUbi(event.block.timestamp);

        communityDaily.volume = communityDaily.volume.plus(normalizedAmount);
        communityDaily.transactions += 1;

        let transactionFrom = UserTransactionsEntity.load(
            event.params.from.toHex()
        );
        let transactionTo = UserTransactionsEntity.load(
            event.params.to.toHex()
        );

        if (event.params.from.notEqual(event.transaction.from)) {
            if (!transactionFrom) {
                ubi.reach += 1;
                ubiDaily.reach += 1;
                communityDaily.reach += 1;
            } else if (transactionFrom.lastTransaction !== dayId) {
                ubiDaily.reach += 1;
                communityDaily.reach += 1;
            }
        } else if (!transactionTo) {
            ubi.reach += 1;
            ubiDaily.reach += 1;
            communityDaily.reach += 1;
        } else if (transactionTo.lastTransaction !== dayId) {
            ubiDaily.reach += 1;
            communityDaily.reach += 1;
        }
        if (!transactionFrom) {
            transactionFrom = new UserTransactionsEntity(
                event.params.from.toHex()
            );
            transactionFrom.volume = BigDecimal.zero();
            transactionFrom.transactions = 0;
        }
        if (!transactionTo) {
            transactionTo = new UserTransactionsEntity(event.params.to.toHex());
            transactionTo.volume = BigDecimal.zero();
            transactionTo.transactions = 0;
        }
        transactionFrom.volume = transactionFrom.volume.plus(normalizedAmount);
        transactionFrom.transactions += 1;
        transactionFrom.lastTransaction = dayId;
        transactionTo.volume = transactionTo.volume.plus(normalizedAmount);
        transactionTo.transactions += 1;
        transactionTo.lastTransaction = dayId;

        ubi.volume = ubi.volume.plus(normalizedAmount);
        ubi.transactions += 1;
        ubiDaily.volume = ubiDaily.volume.plus(normalizedAmount);
        ubiDaily.transactions += 1;

        ubi.save();
        ubiDaily.save();
        transactionFrom.save();
        transactionTo.save();
        communityDaily.save();
    }
    // nothing goes here!
}
