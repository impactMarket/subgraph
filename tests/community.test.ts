import { parseEther } from '@ethersproject/units';
import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import { createCommunityAddedEvent } from './utils';

export { handleCommunityAdded };

test('create community', () => {
    const community = createCommunityAddedEvent(
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        ['0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f'],
        parseEther('5').toString(),
        parseEther('500').toString(),
        parseEther('0.01').toString(),
        '60',
        '17280',
        parseEther('1').toString(),
        parseEther('50').toString()
    );

    handleCommunityAdded(community);

    assert.fieldEquals(
        'CommunityEntity',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        'claimAmount',
        parseEther('5').toString()
    );

    clearStore();
});
