import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import {
    handleBeneficiaryAdded,
    handleBeneficiaryClaim,
    handleManagerAdded,
} from '../src/mappings/community';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import { createCommunityAddedEvent } from './utils/community';
import { communityAddress, managerAddress } from './utils/constants';
import { createManagerAddedEvent } from './utils/manager';

export { handleBeneficiaryAdded, handleBeneficiaryClaim };

test('add manager', () => {
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

    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'totalManagers',
        '2'
    );

    const dayId = managerAddedEvent2.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `${communityAddress[0]}-${dayId}`,
        'managers',
        '2'
    );

    // assert ubi daily data
    assert.fieldEquals('UBIDailyEntity', dayId.toString(), 'managers', '2');

    clearStore();
});
