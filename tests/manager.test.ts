import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import {
    communityAddress,
    communityProps,
    managerAddress
} from './utils/constants';
import { createCommunityAddedEvent } from './utils/community';
import {
    createManagerAddedEvent,
    createManagerRemovedEvent
} from './utils/manager';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import {
    handleManagerAdded,
    handleManagerRemoved
} from '../src/mappings/community';

export { handleCommunityAdded, handleManagerAdded };

test('add manager', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '1');
    assert.fieldEquals('UBIEntity', '0', 'managers', '1');

    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0]
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[2],
        communityAddress[0]
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);

    assert.fieldEquals(
        'ManagerEntity',
        managerAddress[1],
        'address',
        managerAddress[1]
    );

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '3');
    assert.fieldEquals('UBIEntity', '0', 'managers', '3');

    // const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    // assert.fieldEquals(
    //     'CommunityDailyEntity',
    //     `${communityAddress[0]}-${dayId}`,
    //     'managers',
    //     '3'
    // );

    // // assert ubi daily data
    // assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '3');
});

test('remove manager', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0]
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[2],
        communityAddress[0]
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '3');
    assert.fieldEquals('UBIEntity', '0', 'managers', '3');

    const managerRemovedEvent1 = createManagerRemovedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0]
    );

    handleManagerRemoved(managerRemovedEvent1);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '2');
    assert.fieldEquals('UBIEntity', '0', 'managers', '2');

    // const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    // assert.fieldEquals(
    //     'CommunityDailyEntity',
    //     `${communityAddress[0]}-${dayId}`,
    //     'managers',
    //     '2'
    // );

    // // assert ubi daily data
    // assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '2');
});

test('remove manager (and readd)', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0]
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[2],
        communityAddress[0]
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);

    const managerRemovedEvent1 = createManagerRemovedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0]
    );

    handleManagerRemoved(managerRemovedEvent1);

    const managerAddedEvent3 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0]
    );

    handleManagerAdded(managerAddedEvent3);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '3');
    assert.fieldEquals('UBIEntity', '0', 'managers', '3');

    // const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    // assert.fieldEquals(
    //     'CommunityDailyEntity',
    //     `${communityAddress[0]}-${dayId}`,
    //     'managers',
    //     '3'
    // );

    // // assert ubi daily data
    // assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '3');
});

// TODO: also test UBIEntity in all cases

// TODO: test manager on migrated community
