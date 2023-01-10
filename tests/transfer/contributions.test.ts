import { BigInt } from '@graphprotocol/graph-ts';
import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import { cUSDAddress, treasuryAddress } from '../../src/common/addresses';
import { communityAddress, communityProps, managerAddress, toToken, userAddress } from '../utils/constants';
import { createCommunityAddedEvent } from '../utils/community';
import { createTransferEvent } from '../utils/transfer';
import { handleCommunityAdded } from '../../src/mappings/communityAdmin';
import { handleTransferAsset } from '../../src/mappings/transfer';
import { normalize } from '../../src/utils/index';

export { handleTransferAsset };

const fiveDollars = toToken('5');

test('contribute cusd to community', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    const transferEvent1 = createTransferEvent(
        userAddress[0],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress
    );
    const transferEvent2 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');
    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId}`,
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${communityAddress[0]}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${communityAddress[0]}-${dayId}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${dayId}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'contributions',
        `[${cUSDAddress}-${communityAddress[0]}]`
    );
    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId}`,
        'contributions',
        `[${cUSDAddress}-${communityAddress[0]}-${dayId}]`
    );
    assert.fieldEquals('UBIDailyEntity', `${dayId}`, 'contributions', `[${cUSDAddress}-${dayId}]`);
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
        'UBIDailyEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', '0', 'contributors', '2');
});

test('contribute cusd to treasury', () => {
    clearStore();

    // community generate the UBIDailyEntity
    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    const transferEvent1 = createTransferEvent(userAddress[0], treasuryAddress, fiveDollars.toString(), cUSDAddress);
    const transferEvent2 = createTransferEvent(userAddress[1], treasuryAddress, fiveDollars.toString(), cUSDAddress);

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    // assert ubi daily data
    assert.fieldEquals(
        'UBIDailyEntity',
        dayId.toString(),
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributions', '[]');
    assert.notInStore('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`);
    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${dayId}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', `${dayId}`, 'contributions', `[${cUSDAddress}-${dayId}]`);
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'contributors', '2');
    assert.fieldEquals(
        'UBIDailyEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', '0', 'contributors', '2');
});

test('contribute cusd to treasury and community', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    // to treasury
    const transferEvent1 = createTransferEvent(userAddress[0], treasuryAddress, fiveDollars.toString(), cUSDAddress);

    // to treasury
    const transferEvent2 = createTransferEvent(userAddress[1], treasuryAddress, fiveDollars.toString(), cUSDAddress);

    // to community
    const transferEvent3 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress
    );

    // from treasury to community
    const transferEvent4 = createTransferEvent(
        treasuryAddress,
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);
    handleTransferAsset(transferEvent3);
    handleTransferAsset(transferEvent4);

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
        'UBIDailyEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', '0', 'contributors', '2');
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
    const transferEvent1 = createTransferEvent(
        userAddress[0],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day1Time
    );

    // to treasury
    const transferEvent2 = createTransferEvent(
        userAddress[1],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day1Time
    );

    // to community
    const transferEvent3 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress,
        day1Time
    );

    // from treasury to community
    const transferEvent4 = createTransferEvent(
        treasuryAddress,
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress,
        day1Time
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);
    handleTransferAsset(transferEvent3);
    handleTransferAsset(transferEvent4);

    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${communityAddress[0]}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'contributions',
        `[${cUSDAddress}-${communityAddress[0]}]`
    );
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');
    assert.fieldEquals(
        'UBIDailyEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', '0', 'contributors', '2');

    // day 2

    // to treasury
    const transferEvent5 = createTransferEvent(
        userAddress[2],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day2Time
    );

    // to community
    const transferEvent6 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress,
        day2Time
    );

    handleTransferAsset(transferEvent5);
    handleTransferAsset(transferEvent6);

    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${communityAddress[0]}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'contributions',
        `[${cUSDAddress}-${communityAddress[0]}]`
    );
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');
    assert.fieldEquals(
        'UBIDailyEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(5)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', '0', 'contributors', '3');

    // day 3

    // to treasury
    const transferEvent7 = createTransferEvent(
        userAddress[0],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day3Time
    );

    // to treasury
    const transferEvent8 = createTransferEvent(
        userAddress[0],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day3Time
    );

    // to treasury
    const transferEvent9 = createTransferEvent(
        userAddress[1],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day3Time
    );

    // from treasury to community
    const transferEvent10 = createTransferEvent(
        treasuryAddress,
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress,
        day3Time
    );

    handleTransferAsset(transferEvent7);
    handleTransferAsset(transferEvent8);
    handleTransferAsset(transferEvent9);
    handleTransferAsset(transferEvent10);

    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${communityAddress[0]}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(4)).toString()).toString()
    );
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'contributions',
        `[${cUSDAddress}-${communityAddress[0]}]`
    );
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');
    assert.fieldEquals(
        'UBIDailyEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(8)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', '0', 'contributors', '3');

    // day 4

    // to community
    const transferEvent11 = createTransferEvent(
        userAddress[0],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress,
        day4Time
    );

    // to community
    const transferEvent12 = createTransferEvent(
        userAddress[2],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress,
        day4Time
    );

    // to treasury
    const transferEvent13 = createTransferEvent(
        userAddress[1],
        treasuryAddress,
        fiveDollars.toString(),
        cUSDAddress,
        day4Time
    );

    handleTransferAsset(transferEvent11);
    handleTransferAsset(transferEvent12);
    handleTransferAsset(transferEvent13);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '4');
    assert.fieldEquals(
        'UBIDailyEntity',
        '0',
        'contributed',
        normalize(fiveDollars.times(BigInt.fromI32(11)).toString()).toString()
    );
    assert.fieldEquals('UBIDailyEntity', '0', 'contributors', '3');

    // day 1

    const dayId1 = day1Time / 86400;

    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${communityAddress[0]}-${dayId1}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${dayId1}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId1}`,
        'contributions',
        `[${cUSDAddress}-${communityAddress[0]}-${dayId1}]`
    );
    assert.fieldEquals('UBIDailyEntity', `${dayId1}`, 'contributions', `[${cUSDAddress}-${dayId1}]`);
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
        'AssetContributions',
        `${cUSDAddress}-${communityAddress[0]}-${dayId2}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(1)).toString()).toString()
    );
    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${dayId2}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId2}`,
        'contributions',
        `[${cUSDAddress}-${communityAddress[0]}-${dayId2}]`
    );
    assert.fieldEquals('UBIDailyEntity', `${dayId2}`, 'contributions', `[${cUSDAddress}-${dayId2}]`);
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
        'AssetContributions',
        `${cUSDAddress}-${communityAddress[0]}-${dayId3}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(1)).toString()).toString()
    );
    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${dayId3}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(3)).toString()).toString()
    );
    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId3}`,
        'contributions',
        `[${cUSDAddress}-${communityAddress[0]}-${dayId3}]`
    );
    assert.fieldEquals('UBIDailyEntity', `${dayId3}`, 'contributions', `[${cUSDAddress}-${dayId3}]`);
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

    const transferEvent1 = createTransferEvent(
        userAddress[0],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress
    );
    const transferEvent2 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);

    assert.fieldEquals('ContributorEntity', userAddress[0], 'contributions', `[${cUSDAddress}-${userAddress[0]}]`);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');

    const transferEvent3 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress
    );
    const dayId = transferEvent3.block.timestamp.toI32() / 86400;

    handleTransferAsset(transferEvent3);

    assert.fieldEquals('ContributorEntity', userAddress[1], 'contributions', `[${cUSDAddress}-${userAddress[1]}]`);
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'contributors', '2');
    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'contributors', '2');
    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${userAddress[1]}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
});

test('contribute cusd to community and update contributor entities, many communities', () => {
    clearStore();

    const community1 = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);
    const community2 = createCommunityAddedEvent(communityAddress[1], [managerAddress[1]], communityProps[0]);

    handleCommunityAdded(community1);
    handleCommunityAdded(community2);

    const transferEvent1 = createTransferEvent(
        userAddress[0],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress
    );
    const transferEvent2 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        fiveDollars.toString(),
        cUSDAddress
    );
    const transferEvent3 = createTransferEvent(
        userAddress[0],
        communityAddress[1],
        fiveDollars.toString(),
        cUSDAddress
    );

    handleTransferAsset(transferEvent1);
    handleTransferAsset(transferEvent2);
    handleTransferAsset(transferEvent3);

    assert.fieldEquals('ContributorEntity', userAddress[0], 'contributions', `[${cUSDAddress}-${userAddress[0]}]`);

    const transferEvent4 = createTransferEvent(
        userAddress[1],
        communityAddress[1],
        fiveDollars.toString(),
        cUSDAddress
    );

    handleTransferAsset(transferEvent4);

    assert.fieldEquals('ContributorEntity', userAddress[1], 'contributions', `[${cUSDAddress}-${userAddress[1]}]`);
    assert.fieldEquals(
        'AssetContributions',
        `${cUSDAddress}-${userAddress[1]}`,
        'amount',
        normalize(fiveDollars.times(BigInt.fromI32(2)).toString()).toString()
    );
});
