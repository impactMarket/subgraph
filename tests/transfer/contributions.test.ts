import { BigInt } from '@graphprotocol/graph-ts';
import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import { communityAddress, communityProps, managerAddress, toToken, userAddress } from '../utils/constants';
import { createCommunityAddedEvent } from '../utils/community';
import { createTransferEvent } from '../utils/transfer';
import { handleCommunityAdded } from '../../src/mappings/communityAdmin';
import { handleTransferCeloDollar } from '../../src/mappings/transfer';
import { normalize } from '../../src/utils/index';
import { treasuryAddress } from '../../src/common/addresses';

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
