import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import {
    communityAddress,
    communityProps,
    managerAddress,
    normalize
} from './utils/constants';
import {
    createCommunityAddedEvent,
    createCommunityMigratedEvent,
    createCommunityRemovedEvent
} from './utils/community';
import {
    handleCommunityAdded,
    handleCommunityMigrated,
    handleCommunityRemoved
} from '../src/mappings/communityAdmin';

export { handleCommunityAdded, handleCommunityRemoved };

test('create community', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'claimAmount',
        normalize(communityProps[0].get('claimAmount')).toString()
    );
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'decreaseStep',
        normalize(communityProps[0].get('decreaseStep')).toString()
    );
    assert.fieldEquals('UBIEntity', '0', 'communities', '1');
    assert.fieldEquals(
        'ManagerEntity',
        managerAddress[0],
        'community',
        communityAddress[0]
    );
});

test('remove community', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    const communityRemove = createCommunityRemovedEvent(communityAddress[0]);

    handleCommunityRemoved(communityRemove);

    assert.fieldEquals('UBIEntity', '0', 'communities', '0');

    // TODO: verify if manager was removed
});

test('migrate community', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    const communityMigrated = createCommunityMigratedEvent(
        [managerAddress[0]],
        communityAddress[1],
        communityAddress[0]
    );

    handleCommunityMigrated(communityMigrated);

    assert.fieldEquals('CommunityEntity', communityAddress[1], 'managers', '1');
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[1],
        'previous',
        communityAddress[0]
    );
    assert.fieldEquals(
        'ManagerEntity',
        managerAddress[0],
        'community',
        communityAddress[1]
    );
});

test('migrate community with different managers', () => {
    clearStore();

    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    const communityMigrated = createCommunityMigratedEvent(
        [managerAddress[1]],
        communityAddress[1],
        communityAddress[0]
    );

    handleCommunityMigrated(communityMigrated);

    assert.fieldEquals('CommunityEntity', communityAddress[1], 'managers', '1');
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[1],
        'previous',
        communityAddress[0]
    );
    assert.fieldEquals(
        'ManagerEntity',
        managerAddress[1],
        'community',
        communityAddress[1]
    );
});

// TODO: also test UBIEntity in all cases

// TODO: test migration with different managers

// TODO: test number of managers and beneficiaries after removal
