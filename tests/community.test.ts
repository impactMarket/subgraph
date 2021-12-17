import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import { handleManagerAdded } from '../src/mappings/community';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import { createCommunityAddedEvent, createManagerAddedEvent } from './utils';

export { handleCommunityAdded, handleManagerAdded };

test('create community', () => {
    const community = createCommunityAddedEvent(
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
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
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        'claimAmount',
        '5'
    );

    clearStore();
});

test('add managers', () => {
    const community = createCommunityAddedEvent(
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
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
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        '0x88b101c163bbfe1dc4764225248a6dad282d7a39',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
    );

    handleManagerAdded(managerAddedEvent1);
    handleManagerAdded(managerAddedEvent2);

    assert.fieldEquals(
        'ManagerEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f-0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        'address',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f'
    );

    clearStore();
});
