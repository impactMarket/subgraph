import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import {
    handleBeneficiaryAdded,
    handleBeneficiaryClaim,
    handleManagerAdded,
} from '../src/mappings/community';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import { createCommunityAddedEvent } from './utils/community';
import { createManagerAddedEvent } from './utils/manager';

export { handleBeneficiaryAdded, handleBeneficiaryClaim };

test('add manager', () => {
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
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
    );

    const managerAddedEvent2 = createManagerAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
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
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        'totalManagers',
        '2'
    );

    const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `0x1cad798788568098e51c5751fe03a8daa0c7eac6-${dayId}`,
        'managers',
        '2'
    );

    clearStore();
});
