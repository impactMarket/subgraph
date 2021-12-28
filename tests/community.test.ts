import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import { handleManagerAdded } from '../src/mappings/community';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import { createCommunityAddedEvent } from './utils/community';
import { communityAddress } from './utils/constants';
import { createManagerAddedEvent } from './utils/manager';

export { handleCommunityAdded, handleManagerAdded };

test('create community', () => {
    const community = createCommunityAddedEvent(
        communityAddress[0],
        ['0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f'],
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

test('add managers', () => {
    const community = createCommunityAddedEvent(
        communityAddress[0],
        ['0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f'],
        '5',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0'
    );

    handleCommunityAdded(community);

    const managerAddedEvent1 = createManagerAddedEvent(
        communityAddress[0],
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        communityAddress[0]
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        communityAddress[0],
        '0x88b101c163bbfe1dc4764225248a6dad282d7a39', // prevent adding community admin
        communityAddress[0]
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);

    assert.fieldEquals(
        'ManagerEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'address',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f'
    );

    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'totalManagers',
        '1'
    );

    clearStore();
});
