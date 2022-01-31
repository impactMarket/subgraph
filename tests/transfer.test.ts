import { BigInt } from '@graphprotocol/graph-ts';
import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import {
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
import { treasuryAddress } from '../src/common/addresses';

export { handleTransferCeloDollar };

const fiveDollars = toToken('5');

test('contribute cusd to community', () => {
    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    const transferEvent1 = createTransferEvent(
        userAddress[0],
        communityAddress[0],
        fiveDollars.toString()
    );

    const transferEvent2 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString()
    );

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    // assert ubi daily data
    assert.fieldEquals(
        'UBIDailyEntity',
        dayId.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    clearStore();
});

test('contribute cusd to treasury', () => {
    // community generate the UBIEntity
    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);
    //

    const transferEvent1 = createTransferEvent(
        userAddress[0],
        treasuryAddress,
        fiveDollars.toString()
    );

    const transferEvent2 = createTransferEvent(
        userAddress[1],
        treasuryAddress,
        fiveDollars.toString()
    );

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
    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    clearStore();
});

test('contribute cusd to treasury and community', () => {
    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    // to treasury
    const transferEvent1 = createTransferEvent(
        userAddress[0],
        treasuryAddress,
        fiveDollars.toString()
    );

    // to treasury
    const transferEvent2 = createTransferEvent(
        userAddress[1],
        treasuryAddress,
        fiveDollars.toString()
    );

    // to community
    const transferEvent3 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString()
    );

    // from treasury to community
    const transferEvent4 = createTransferEvent(
        treasuryAddress,
        communityAddress[0],
        fiveDollars.toString()
    );

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);
    handleTransferCeloDollar(transferEvent3);
    handleTransferCeloDollar(transferEvent4);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    // assert ubi daily data
    assert.fieldEquals(
        'UBIDailyEntity',
        dayId.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals(
        'UBIEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );

    clearStore();
});

test('contribute cusd to community and update contributor entities', () => {
    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    const transferEvent1 = createTransferEvent(
        userAddress[0],
        communityAddress[0],
        fiveDollars.toString()
    );

    const transferEvent2 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString()
    );

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[0],
        'contributed',
        normalize(fiveDollars.toString()).toString()
    );

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[0],
        'contributions',
        '1'
    );

    const transferEvent3 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString()
    );

    handleTransferCeloDollar(transferEvent3);

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[1],
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[1],
        'contributions',
        '2'
    );

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

    clearStore();
});

test('contribute cusd to community and update contributor entities, many communities', () => {
    const community1 = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );
    const community2 = createCommunityAddedEvent(
        communityAddress[1],
        [managerAddress[1]],
        communityProps[0]
    );

    handleCommunityAdded(community1);
    handleCommunityAdded(community2);

    const transferEvent1 = createTransferEvent(
        userAddress[0],
        communityAddress[0],
        fiveDollars.toString()
    );

    const transferEvent2 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString()
    );

    const transferEvent3 = createTransferEvent(
        userAddress[0],
        communityAddress[1],
        fiveDollars.toString()
    );

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);
    handleTransferCeloDollar(transferEvent3);

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[0],
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[0],
        'contributions',
        '2'
    );

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

    const transferEvent4 = createTransferEvent(
        userAddress[1],
        communityAddress[1],
        fiveDollars.toString()
    );

    handleTransferCeloDollar(transferEvent4);

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[1],
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );

    assert.fieldEquals(
        'ContributorEntity',
        userAddress[1],
        'contributions',
        '2'
    );

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

    clearStore();
});

// User Transactions

test('should count first time user transactions', () => {
    // TODO:
});

test('should count multiple user transactions, same day', () => {
    // TODO:
});

test('should count multiple user transactions, different days', () => {
    // TODO:
});

test('should not count user transactions if none parties are a beneficiary', () => {
    // TODO:
});

test('should not count user transactions if from forbiden address', () => {
    // TODO:
});

test('should not count user transactions if from community', () => {
    // TODO:
});
