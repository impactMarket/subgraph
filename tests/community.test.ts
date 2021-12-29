import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import { handleManagerAdded } from '../src/mappings/community';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import { createCommunityAddedEvent } from './utils/community';
import { communityAddress, managerAddress } from './utils/constants';
import { createManagerAddedEvent } from './utils/manager';

export { handleCommunityAdded, handleManagerAdded };

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

test('add managers', () => {
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

    const managerAddedEvent1 = createManagerAddedEvent(
        communityAddress[0],
        managerAddress[0],
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
        managerAddress[0],
        'address',
        managerAddress[0]
    );

    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'totalManagers',
        '1'
    );

    clearStore();
});
