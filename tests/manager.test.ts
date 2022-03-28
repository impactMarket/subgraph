import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import { communityAddress, communityProps, managerAddress } from './utils/constants';
import { createCommunityAddedEvent, createCommunityMigratedEvent } from './utils/community';
import { createManagerAddedEvent, createManagerRemovedEvent } from './utils/manager';
import { handleCommunityAdded, handleCommunityMigrated } from '../src/mappings/communityAdmin';
import { handleManagerAdded, handleManagerRemoved } from '../src/mappings/community';

import { communityAdminAddress } from '../src/common/addresses';

export { handleCommunityAdded, handleManagerAdded };

test('add manager', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0],
        1646650968
    );

    handleCommunityAdded(community);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '1');
    assert.fieldEquals('UBIEntity', '0', 'managers', '1');

    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        1646650969
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[2],
        communityAddress[0],
        1646650970
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);

    assert.fieldEquals('ManagerEntity', managerAddress[1], 'address', managerAddress[1]);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '3');
    assert.fieldEquals('UBIEntity', '0', 'managers', '3');

    const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'managers', '3');

    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '3');
});

test('add later forbidden manager', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0],
        1646650968
    );

    handleCommunityAdded(community);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '1');
    assert.fieldEquals('UBIEntity', '0', 'managers', '1');

    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        1646650969
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[2],
        communityAddress[0],
        1646650970
    );

    const managerAddedEvent3 = createManagerAddedEvent(
        managerAddress[0],
        communityAdminAddress,
        communityAddress[0],
        1646650971
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);
    handleManagerAdded(managerAddedEvent3);

    assert.fieldEquals('ManagerEntity', managerAddress[1], 'address', managerAddress[1]);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '3');
    assert.fieldEquals('UBIEntity', '0', 'managers', '3');

    const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'managers', '3');

    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '3');
});

test('add forbidden manager at deploy', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [communityAdminAddress, managerAddress[0]],
        communityProps[0],
        1646650968
    );

    handleCommunityAdded(community);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '1');
    assert.fieldEquals('UBIEntity', '0', 'managers', '1');

    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        1646650969
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[2],
        communityAddress[0],
        1646650970
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);

    assert.fieldEquals('ManagerEntity', managerAddress[1], 'address', managerAddress[1]);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '3');
    assert.fieldEquals('UBIEntity', '0', 'managers', '3');

    const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'managers', '3');

    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '3');
});

test('remove manager', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0],
        1646650968
    );

    handleCommunityAdded(community);

    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        1646650969
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[2],
        communityAddress[0],
        1646650970
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '3');
    assert.fieldEquals('UBIEntity', '0', 'managers', '3');

    const managerRemovedEvent1 = createManagerRemovedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        1646650971
    );

    handleManagerRemoved(managerRemovedEvent1);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '2');
    assert.fieldEquals('UBIEntity', '0', 'managers', '2');

    const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'managers', '2');

    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '2');
});

test('remove manager (and readd)', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0],
        1646650968
    );

    handleCommunityAdded(community);

    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        1646650969
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[2],
        communityAddress[0],
        1646650970
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);

    const managerRemovedEvent1 = createManagerRemovedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        1646650971
    );

    handleManagerRemoved(managerRemovedEvent1);

    const managerAddedEvent3 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        1646650972
    );

    handleManagerAdded(managerAddedEvent3);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '3');
    assert.fieldEquals('UBIEntity', '0', 'managers', '3');

    const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'managers', '3');

    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '3');
});

test('add manager - different days', () => {
    clearStore();

    // first day

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0],
        1646650968
    );

    handleCommunityAdded(community);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '1');
    assert.fieldEquals('UBIEntity', '0', 'managers', '1');

    const day1Timestamp = 1646650969;
    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        day1Timestamp
    );

    handleManagerAdded(managerAddedEvent1);

    // second day

    const day2Timestamp = 1646781656;
    const managerAddedEvent2 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[2],
        communityAddress[0],
        day2Timestamp
    );

    handleManagerAdded(managerAddedEvent2);

    // third day

    const day3Timestamp = 1646831655;
    const managerRemovedEvent1 = createManagerRemovedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        day3Timestamp
    );

    handleManagerRemoved(managerRemovedEvent1);

    const managerAddedEvent3 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[3],
        communityAddress[0],
        day3Timestamp + 1
    );
    const managerAddedEvent4 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[4],
        communityAddress[0],
        day3Timestamp + 2
    );

    handleManagerAdded(managerAddedEvent3);
    handleManagerAdded(managerAddedEvent4);

    // asserts

    assert.fieldEquals('ManagerEntity', managerAddress[1], 'address', managerAddress[1]);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '4');
    assert.fieldEquals('UBIEntity', '0', 'managers', '4');

    // first day

    const dayId = day1Timestamp / 86400;

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'managers', '2');

    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '2');

    // second day

    const dayId2 = day2Timestamp / 86400;

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId2}`, 'managers', '1');

    assert.fieldEquals('UBIDailyEntity', dayId2.toString(), 'managers', '1');

    // third day

    const dayId3 = day3Timestamp / 86400;

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId3}`, 'managers', '1');

    assert.fieldEquals('UBIDailyEntity', dayId3.toString(), 'managers', '1');
});

test('add manager and migrate community', () => {
    clearStore();

    // create community, add managers and test

    const day1Timestamp = 1646650968;
    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0],
        day1Timestamp
    );

    handleCommunityAdded(community);

    const managerAddedEvent1 = createManagerAddedEvent(
        managerAddress[0],
        managerAddress[1],
        communityAddress[0],
        day1Timestamp + 2
    );

    handleManagerAdded(managerAddedEvent1);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'managers', '2');
    assert.fieldEquals('UBIEntity', '0', 'managers', '2');

    assert.fieldEquals('ManagerEntity', managerAddress[1], 'community', communityAddress[0]);

    const dayId = day1Timestamp / 86400;

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[0]}-${dayId}`, 'managers', '2');

    // migrate community

    const day2Timestamp = 1646781656;
    const communityMigrated = createCommunityMigratedEvent(
        [managerAddress[0], managerAddress[1]],
        communityAddress[1],
        communityAddress[0],
        day2Timestamp
    );

    handleCommunityMigrated(communityMigrated);

    assert.fieldEquals('ManagerEntity', managerAddress[1], 'community', communityAddress[1]);

    assert.fieldEquals('CommunityEntity', communityAddress[1], 'managers', '2');
    assert.fieldEquals('UBIEntity', '0', 'managers', '2');

    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '2');

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[1]}-${dayId}`, 'managers', '2');

    assert.fieldEquals('CommunityDailyEntity', `${communityAddress[1]}-${dayId}`, 'managers', '2');
});
