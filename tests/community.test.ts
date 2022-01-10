import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import {
    handleCommunityAdded,
    handleCommunityRemoved,
} from '../src/mappings/communityAdmin';
import {
    createCommunityAddedEvent,
    createCommunityRemovedEvent,
} from './utils/community';
import {
    communityAddress,
    communityProps,
    managerAddress,
} from './utils/constants';

export { handleCommunityAdded, handleCommunityRemoved };

test('create community', () => {
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
        communityProps[0].get('claimAmount')
    );

    assert.fieldEquals('UBIEntity', '0', 'communities', '1');

    clearStore();
});

test('remove community', () => {
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
        communityProps[0].get('claimAmount')
    );

    assert.fieldEquals('UBIEntity', '0', 'communities', '1');

    const communityRemove = createCommunityRemovedEvent(communityAddress[0]);

    handleCommunityRemoved(communityRemove);

    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'claimAmount',
        communityProps[0].get('claimAmount')
    );

    assert.fieldEquals('UBIEntity', '0', 'communities', '0');

    clearStore();
});

// TODO: add tests for community migrated
