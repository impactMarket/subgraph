import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import { createCommunityAddedEvent } from './utils/community';
import { communityAddress, managerAddress } from './utils/constants';

export { handleCommunityAdded };

test('create community', () => {
    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        '5',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0'
    );

    handleCommunityAdded(community);

    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'claimAmount',
        '5'
    );

    clearStore();
});

// TODO: add tests for community removed
// TODO: add tests for community migrated
