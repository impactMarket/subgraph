import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import {
    communityAddress,
    communityProps,
    managerAddress,
    normalize
} from './utils/constants';
import {
    createCommunityAddedEvent,
    createCommunityRemovedEvent
} from './utils/community';
import {
    handleCommunityAdded,
    handleCommunityRemoved
} from '../src/mappings/communityAdmin';

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
        normalize(communityProps[0].get('claimAmount')).toString()
    );
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'decreaseStep',
        normalize(communityProps[0].get('decreaseStep')).toString()
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

    const communityRemove = createCommunityRemovedEvent(communityAddress[0]);

    handleCommunityRemoved(communityRemove);

    assert.fieldEquals('UBIEntity', '0', 'communities', '0');

    clearStore();
});

// TODO: add tests for community migrated
