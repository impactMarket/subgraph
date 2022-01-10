import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import { treasuryAddress } from '../src/common/addresses';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import { handleTransferCeloDollar } from '../src/mappings/transfer';
import { createCommunityAddedEvent } from './utils/community';
import {
    communityAddress,
    communityProps,
    managerAddress,
    userAddress,
} from './utils/constants';
import { createTransferEvent } from './utils/transfer';

export { handleTransferCeloDollar };

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
        '5'
    );

    const transferEvent2 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        '5'
    );

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId}`,
        'contributed',
        '10'
    );

    // assert ubi daily data
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'contributed', '10');
    assert.fieldEquals('UBIEntity', '0', 'contributed', '10');

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
        '5'
    );

    const transferEvent2 = createTransferEvent(
        userAddress[1],
        treasuryAddress,
        '5'
    );

    handleTransferCeloDollar(transferEvent1);
    handleTransferCeloDollar(transferEvent2);

    const dayId = transferEvent1.block.timestamp.toI32() / 86400;

    // assert ubi daily data
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'contributed', '10');
    assert.fieldEquals('UBIEntity', '0', 'contributed', '10');

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
        '5'
    );

    // to treasury
    const transferEvent2 = createTransferEvent(
        userAddress[1],
        treasuryAddress,
        '5'
    );

    // to community
    const transferEvent3 = createTransferEvent(
        userAddress[1],
        communityAddress[0],
        '5'
    );

    // from treasury to community
    const transferEvent4 = createTransferEvent(
        treasuryAddress,
        communityAddress[0],
        '5'
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
        '10'
    );

    // assert ubi daily data
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'contributed', '15');
    assert.fieldEquals('UBIEntity', '0', 'contributed', '15');

    clearStore();
});
