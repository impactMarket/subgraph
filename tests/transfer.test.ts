import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { assert, clearStore, logStore, test } from 'matchstick-as/assembly/index';

import { BeneficiaryEntity, CommunityEntity, ManagerEntity, UBIEntity } from '../generated/schema';
import { attestationProxyAddress, treasuryAddress } from '../src/common/addresses';
import {
    beneficiaryAddress,
    communityAddress,
    communityProps,
    managerAddress,
    toToken,
    userAddress
} from './utils/constants';
import { createCommunityAddedEvent } from './utils/community';
import { createTransferEvent } from './utils/transfer';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import { handleTransferCeloDollar } from '../src/mappings/transfer';
import { normalize } from '../src/utils/index';

export { handleTransferCeloDollar };

const fiveDollars = toToken('5');

test('contribute cusd to community', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    const transferEvent1 = createTransferEvent(userAddress[0], communityAddress[0], fiveDollars.toString());

    const transferEvent2 = createTransferEvent(userAddress[1], communityAddress[0], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'contributors', '2');

    // assert ubi daily data
    assert.fieldEquals(
        'UBIDailyEntity',
        dayId.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'contributors', '2');
    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UBIEntity', '0', 'contributors', '2');
});

test('contribute cusd to treasury', () => {
    clearStore();

    // community generate the UBIEntity
    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);
    //

    const transferEvent1 = createTransferEvent(userAddress[0], treasuryAddress, fiveDollars.toString());

    const transferEvent2 = createTransferEvent(userAddress[1], treasuryAddress, fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    // assert ubi daily data
    assert.fieldEquals(
        'UBIDailyEntity',
        dayId.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'contributors', '2');
    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UBIEntity', '0', 'contributors', '2');
});

test('contribute cusd to treasury and community', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    // to treasury
    const transferEvent1 = createTransferEvent(userAddress[0], treasuryAddress, fiveDollars.toString());

    // to treasury
    const transferEvent2 = createTransferEvent(userAddress[1], treasuryAddress, fiveDollars.toString());

    // to community
    const transferEvent3 = createTransferEvent(userAddress[1], communityAddress[0], fiveDollars.toString());

    // from treasury to community
    const transferEvent4 = createTransferEvent(treasuryAddress, communityAddress[0], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);
    handleTransferCeloDollar(transferEvent3);
    handleTransferCeloDollar(transferEvent4);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'contributors', '2');

    // assert ubi daily data
    assert.fieldEquals(
        'UBIDailyEntity',
        dayId.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'contributors', '2');
    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals('UBIEntity', '0', 'contributors', '2');
});

test('contribute cusd to treasury and community over some days', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    const day1Time = 1640716193;
    const day2Time = 1640816193;
    const day3Time = 1640866193;
    const day4Time = 1640966193;

    // day 1

    // to treasury
    const transferEvent1 = createTransferEvent(userAddress[0], treasuryAddress, fiveDollars.toString(), day1Time);

    // to treasury
    const transferEvent2 = createTransferEvent(userAddress[1], treasuryAddress, fiveDollars.toString(), day1Time);

    // to community
    const transferEvent3 = createTransferEvent(userAddress[1], communityAddress[0], fiveDollars.toString(), day1Time);

    // from treasury to community
    const transferEvent4 = createTransferEvent(treasuryAddress, communityAddress[0], fiveDollars.toString(), day1Time);

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);
    handleTransferCeloDollar(transferEvent3);
    handleTransferCeloDollar(transferEvent4);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');

    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals('UBIEntity', '0', 'contributors', '2');

    // day 2

    // to treasury
    const transferEvent5 = createTransferEvent(userAddress[2], treasuryAddress, fiveDollars.toString(), day2Time);

    // to community
    const transferEvent6 = createTransferEvent(userAddress[1], communityAddress[0], fiveDollars.toString(), day2Time);

    handleTransferCeloDollar(transferEvent5);
    handleTransferCeloDollar(transferEvent6);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');

    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(5)).toString()).toString()
    );
    assert.fieldEquals('UBIEntity', '0', 'contributors', '3');

    // day 3

    // to treasury
    const transferEvent7 = createTransferEvent(userAddress[0], treasuryAddress, fiveDollars.toString(), day3Time);

    // to treasury
    const transferEvent8 = createTransferEvent(userAddress[0], treasuryAddress, fiveDollars.toString(), day3Time);

    // to treasury
    const transferEvent9 = createTransferEvent(userAddress[1], treasuryAddress, fiveDollars.toString(), day3Time);

    // from treasury to community
    const transferEvent10 = createTransferEvent(treasuryAddress, communityAddress[0], fiveDollars.toString(), day3Time);

    handleTransferCeloDollar(transferEvent7);
    handleTransferCeloDollar(transferEvent8);
    handleTransferCeloDollar(transferEvent9);
    handleTransferCeloDollar(transferEvent10);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');
    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(8)).toString()).toString()
    );
    assert.fieldEquals('UBIEntity', '0', 'contributors', '3');

    // day 4

    // to community
    const transferEvent11 = createTransferEvent(userAddress[0], communityAddress[0], fiveDollars.toString(), day4Time);

    // to community
    const transferEvent12 = createTransferEvent(userAddress[2], communityAddress[0], fiveDollars.toString(), day4Time);

    // to treasury
    const transferEvent13 = createTransferEvent(userAddress[1], treasuryAddress, fiveDollars.toString(), day4Time);

    handleTransferCeloDollar(transferEvent11);
    handleTransferCeloDollar(transferEvent12);
    handleTransferCeloDollar(transferEvent13);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '4');
    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(11)).toString()).toString()
    );
    assert.fieldEquals('UBIEntity', '0', 'contributors', '3');

    // day 1

    const dayId1 = day1Time / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId1}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId1}`, 'contributors', '2');

    assert.fieldEquals(
        'UBIDailyEntity',
        dayId1.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', dayId1.toString(), 'contributors', '2');

    // day 2

    const dayId2 = day2Time / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId2}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(1)).toString()).toString()
    );

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2}`, 'contributors', '1');

    assert.fieldEquals(
        'UBIDailyEntity',
        dayId2.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'contributors', '2');

    // day 3

    const dayId3 = day3Time / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId3}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(1)).toString()).toString()
    );

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId3}`, 'contributors', '1');

    assert.fieldEquals(
        'UBIDailyEntity',
        dayId3.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', dayId3.toString(), 'contributors', '2');

    // day 4

    const dayId4 = day4Time / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId4}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId4}`, 'contributors', '2');

    assert.fieldEquals(
        'UBIDailyEntity',
        dayId4.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', dayId4.toString(), 'contributors', '3');
});

test('contribute cusd to community and update contributor entities', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    const transferEvent1 = createTransferEvent(userAddress[0], communityAddress[0], fiveDollars.toString());

    const transferEvent2 = createTransferEvent(userAddress[1], communityAddress[0], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[0],
        'contributed',
        normalize(fiveDollars.toString()).toString()
    );

    assert.fieldEquals('ContributorEntity', userAddress[0], 'contributions', '1');

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');

    const transferEvent3 = createTransferEvent(userAddress[1], communityAddress[0], fiveDollars.toString());

    const dayId = transferEvent3.block.timestamp.toI32() / 86400;

    handleTransferCeloDollar(transferEvent3);

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[1],
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals('ContributorEntity', userAddress[1], 'contributions', '2');

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'contributors', '2');

    assert.fieldEquals(
        'ContributorContributionsEntity',
        `${userAddress[1]}-${communityAddress[0]}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'contributions',
        `[${userAddress[0]}-${communityAddress[0]}, ${userAddress[1]}-${communityAddress[0]}]`
    );
});

test('contribute cusd to community and update contributor entities, many communities', () => {
    clearStore();

    const community1 = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);
    const community2 = createCommunityAddedEvent(communityAddress[1], [managerAddress[1]], communityProps[0]);

    handleCommunityAdded(community1);
    handleCommunityAdded(community2);

    const transferEvent1 = createTransferEvent(userAddress[0], communityAddress[0], fiveDollars.toString());

    const transferEvent2 = createTransferEvent(userAddress[1], communityAddress[0], fiveDollars.toString());

    const transferEvent3 = createTransferEvent(userAddress[0], communityAddress[1], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);
    handleTransferCeloDollar(transferEvent3);

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[0],
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals('ContributorEntity', userAddress[0], 'contributions', '2');

    assert.fieldEquals(
        'ContributorContributionsEntity',
        `${userAddress[0]}-${communityAddress[0]}`,
        'contributed',
        normalize(fiveDollars.toString()).toString()
    );

    assert.fieldEquals(
        'ContributorContributionsEntity',
        `${userAddress[1]}-${communityAddress[0]}`,
        'contributed',
        normalize(fiveDollars.toString()).toString()
    );

    const transferEvent4 = createTransferEvent(userAddress[1], communityAddress[1], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent4);

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[1],
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals('ContributorEntity', userAddress[1], 'contributions', '2');

    assert.fieldEquals(
        'ContributorContributionsEntity',
        `${userAddress[1]}-${communityAddress[0]}`,
        'contributed',
        normalize(fiveDollars.toString()).toString()
    );

    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'contributions',
        `[${userAddress[0]}-${communityAddress[0]}, ${userAddress[1]}-${communityAddress[0]}]`
    );
});

// User Transactions

function createDummyEntities(): void {
    const community = new CommunityEntity(communityAddress[0]);

    community.state = 0;
    community.startDayId = 1;
    community.claimAmount = normalize(fiveDollars.toString());
    community.maxClaim = normalize(fiveDollars.toString());
    community.decreaseStep = normalize(fiveDollars.toString());
    community.baseInterval = 17280;
    community.incrementInterval = 12;
    community.beneficiaries = 2;
    community.removedBeneficiaries = 0;
    community.managers = 1;
    community.removedManagers = 0;
    community.claimed = BigDecimal.zero();
    community.contributed = BigDecimal.zero();
    community.contributors = 0;
    community.save();

    const manager1 = new ManagerEntity(managerAddress[0]);

    manager1.address = Address.fromString(managerAddress[0]);
    manager1.community = communityAddress[0];
    manager1.state = 0;
    manager1.added = 2;
    manager1.removed = 0;
    manager1.since = 1;
    manager1.save();

    const beneficiary1 = new BeneficiaryEntity(beneficiaryAddress[0]);

    beneficiary1.address = Address.fromString(beneficiaryAddress[0]);
    beneficiary1.community = communityAddress[0];
    beneficiary1.state = 0;
    beneficiary1.lastClaimAt = 0;
    beneficiary1.preLastClaimAt = 0;
    beneficiary1.claims = 0;
    beneficiary1.claimed = BigDecimal.zero();
    beneficiary1.save();

    const beneficiary2 = new BeneficiaryEntity(beneficiaryAddress[1]);

    beneficiary2.address = Address.fromString(beneficiaryAddress[1]);
    beneficiary2.community = communityAddress[0];
    beneficiary2.state = 0;
    beneficiary2.lastClaimAt = 0;
    beneficiary2.preLastClaimAt = 0;
    beneficiary2.claims = 0;
    beneficiary2.claimed = BigDecimal.zero();
    beneficiary2.save();

    const community1 = new CommunityEntity(communityAddress[1]);

    community1.state = 0;
    community1.startDayId = 1;
    community1.claimAmount = normalize(fiveDollars.toString());
    community1.maxClaim = normalize(fiveDollars.toString());
    community1.decreaseStep = normalize(fiveDollars.toString());
    community1.baseInterval = 17280;
    community1.incrementInterval = 12;
    community1.beneficiaries = 2;
    community1.removedBeneficiaries = 0;
    community1.managers = 1;
    community1.removedManagers = 0;
    community1.claimed = BigDecimal.zero();
    community1.contributed = BigDecimal.zero();
    community1.contributors = 0;
    community1.save();

    const manager2 = new ManagerEntity(managerAddress[0]);

    manager2.address = Address.fromString(managerAddress[1]);
    manager2.community = communityAddress[1];
    manager2.state = 0;
    manager2.added = 2;
    manager2.removed = 0;
    manager2.since = 1;
    manager2.save();

    const beneficiary3 = new BeneficiaryEntity(beneficiaryAddress[2]);

    beneficiary3.address = Address.fromString(beneficiaryAddress[2]);
    beneficiary3.community = communityAddress[1];
    beneficiary3.state = 0;
    beneficiary3.lastClaimAt = 0;
    beneficiary3.preLastClaimAt = 0;
    beneficiary3.claims = 0;
    beneficiary3.claimed = BigDecimal.zero();
    beneficiary3.save();

    const beneficiary4 = new BeneficiaryEntity(beneficiaryAddress[3]);

    beneficiary4.address = Address.fromString(beneficiaryAddress[3]);
    beneficiary4.community = communityAddress[1];
    beneficiary4.state = 0;
    beneficiary4.lastClaimAt = 0;
    beneficiary4.preLastClaimAt = 0;
    beneficiary4.claims = 0;
    beneficiary4.claimed = BigDecimal.zero();
    beneficiary4.save();

    const ubi = new UBIEntity('0');

    ubi.communities = 2;
    ubi.beneficiaries = 4;
    ubi.managers = 2;
    ubi.claimed = BigDecimal.zero();
    ubi.contributed = BigDecimal.zero();
    ubi.contributors = 0;
    ubi.volume = BigDecimal.zero();
    ubi.transactions = 0;
    ubi.reach = 0;
    ubi.save();
}

test('should count first time user transactions', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(beneficiaryAddress[0], beneficiaryAddress[1], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.toString()).toString()
    );

    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '1');

    assert.fieldEquals('UBIEntity', '0', 'transactions', '1');
    assert.fieldEquals('UBIEntity', '0', 'reach', '1');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'transactions', '1');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'transactions', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'reach', '1');
});

test('should count multiple user transactions, same day', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(beneficiaryAddress[0], beneficiaryAddress[1], fiveDollars.toString());

    const transferEvent2 = createTransferEvent(beneficiaryAddress[0], beneficiaryAddress[1], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '2');

    assert.fieldEquals('UBIEntity', '0', 'transactions', '2');
    assert.fieldEquals('UBIEntity', '0', 'reach', '1');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'transactions', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'reach', '1');
});

test('should count multiple users multiple transactions, same day', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(beneficiaryAddress[0], beneficiaryAddress[1], fiveDollars.toString());

    const transferEvent2 = createTransferEvent(beneficiaryAddress[0], beneficiaryAddress[2], fiveDollars.toString());

    const transferEvent3 = createTransferEvent(beneficiaryAddress[1], beneficiaryAddress[3], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);
    handleTransferCeloDollar(transferEvent3);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '2');
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[1], 'transactions', '2');

    assert.fieldEquals('UBIEntity', '0', 'transactions', '3');
    assert.fieldEquals('UBIEntity', '0', 'reach', '3');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'transactions', '3');
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'reach', '3');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'transactions', '3');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId.toString()}`, 'reach', '3');
});

test('should count multiple users multiple transactions, different days', () => {
    clearStore();

    createDummyEntities();

    // day 1

    const day1Time = 1640716193;

    const transferEvent1 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        day1Time
    );
    const transferEvent2 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[2],
        fiveDollars.toString(),
        day1Time + 1
    );

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    // day 2

    const day2Time = 1640802593;

    const transferEvent3 = createTransferEvent(
        beneficiaryAddress[1],
        beneficiaryAddress[2],
        fiveDollars.toString(),
        day2Time
    );

    const transferEvent4 = createTransferEvent(
        beneficiaryAddress[2],
        beneficiaryAddress[3],
        fiveDollars.toString(),
        day2Time + 1
    );

    handleTransferCeloDollar(transferEvent3);
    handleTransferCeloDollar(transferEvent4);

    const dayId1 = day1Time / 86400;
    const dayId2 = day2Time / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '2');
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[1], 'transactions', '2');
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[2], 'transactions', '3');
    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[3], 'transactions', '1');

    assert.fieldEquals('UBIEntity', '0', 'transactions', '4');
    assert.fieldEquals('UBIEntity', '0', 'reach', '3');
    assert.fieldEquals('UBIDailyEntity', dayId1.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId1.toString(), 'reach', '2');
    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'reach', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId1.toString()}`, 'transactions', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId1.toString()}`, 'reach', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2.toString()}`, 'transactions', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2.toString()}`, 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[1]}-${dayId2.toString()}`, 'transactions', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[1]}-${dayId2.toString()}`, 'reach', '1');
});

test('should count multiple user transactions, different days', () => {
    clearStore();

    createDummyEntities();

    // day 1

    const transferEvent1 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        1640716193
    );
    const transferEvent2 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        1640716194
    );

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    // day 2

    const transferEvent3 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        1640802593
    );

    const transferEvent4 = createTransferEvent(
        beneficiaryAddress[0],
        beneficiaryAddress[1],
        fiveDollars.toString(),
        1640802594
    );

    handleTransferCeloDollar(transferEvent3);
    handleTransferCeloDollar(transferEvent4);

    const dayId1 = transferEvent1.block.timestamp.toI32() / 86400;
    const dayId2 = transferEvent3.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'UserTransactionsEntity',
        beneficiaryAddress[0],
        'volume',
        normalize(fiveDollars.times(BigInt.fromI32(4)).toString()).toString()
    );

    assert.fieldEquals('UserTransactionsEntity', beneficiaryAddress[0], 'transactions', '4');

    assert.fieldEquals('UBIEntity', '0', 'transactions', '4');
    assert.fieldEquals('UBIEntity', '0', 'reach', '1');
    assert.fieldEquals('UBIDailyEntity', dayId1.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'transactions', '2');
    assert.fieldEquals('UBIDailyEntity', dayId1.toString(), 'reach', '1');
    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId1.toString()}`, 'transactions', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId1.toString()}`, 'reach', '1');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2.toString()}`, 'transactions', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2.toString()}`, 'reach', '1');
});

test('should not count user transactions if none parties are a beneficiary', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(userAddress[0], userAddress[1], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);

    assert.notInStore('UserTransactionsEntity', beneficiaryAddress[0]);

    assert.fieldEquals('UBIEntity', '0', 'transactions', '0');
    assert.fieldEquals('UBIEntity', '0', 'reach', '0');
});

test('should not count user transactions if from forbiden address', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(beneficiaryAddress[0], attestationProxyAddress, fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);

    assert.notInStore('UserTransactionsEntity', beneficiaryAddress[0]);

    assert.fieldEquals('UBIEntity', '0', 'transactions', '0');
    assert.fieldEquals('UBIEntity', '0', 'reach', '0');
});

test('should not count user transactions if from community', () => {
    clearStore();

    createDummyEntities();

    const transferEvent1 = createTransferEvent(communityAddress[0], beneficiaryAddress[0], fiveDollars.toString());

    handleTransferCeloDollar(transferEvent1);

    assert.notInStore('UserTransactionsEntity', beneficiaryAddress[0]);

    assert.fieldEquals('UBIEntity', '0', 'transactions', '0');
    assert.fieldEquals('UBIEntity', '0', 'reach', '0');
});
