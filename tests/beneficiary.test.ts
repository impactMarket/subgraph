import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import {
    handleBeneficiaryAdded,
    handleBeneficiaryClaim,
} from '../src/mappings/community';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import {
    createBeneficiaryAddedEvent,
    createBeneficiaryClaimEvent,
    createCommunityAddedEvent,
} from './utils';

export { handleBeneficiaryAdded, handleBeneficiaryClaim };

test('add beneficiary', () => {
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

    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
    );

    const beneficiaryAddedEvent2 = createBeneficiaryAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
    );

    handleBeneficiaryAdded(beneficiaryAddedEvent1);
    handleBeneficiaryAdded(beneficiaryAddedEvent2);

    assert.fieldEquals(
        'BeneficiaryEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'address',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f'
    );

    clearStore();
});

test('add claim', () => {
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

    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
    );

    const beneficiaryAddedEvent2 = createBeneficiaryAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
    );

    handleBeneficiaryAdded(beneficiaryAddedEvent1);
    handleBeneficiaryAdded(beneficiaryAddedEvent2);

    const beneficiaryClaimEvent1 = createBeneficiaryClaimEvent(
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        '5',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
    );

    const beneficiaryClaimEvent2 = createBeneficiaryClaimEvent(
        '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
        '5',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6'
    );

    handleBeneficiaryClaim(beneficiaryClaimEvent1);
    handleBeneficiaryClaim(beneficiaryClaimEvent2);

    assert.fieldEquals(
        'BeneficiaryEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'address',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f'
    );

    assert.fieldEquals(
        'BeneficiaryEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'lastClaimAt',
        beneficiaryAddedEvent1.block.timestamp.toString()
    );

    assert.fieldEquals(
        'CommunityEntity',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        'totalClaimed',
        '10'
    );

    assert.fieldEquals(
        'CommunityEntity',
        '0x1cad798788568098e51c5751fe03a8daa0c7eac6',
        'totalBeneficiaries',
        '2'
    );

    const dayId = beneficiaryAddedEvent2.block.timestamp.toI32() / 86400;

    assert.fieldEquals(
        'CommunityDailyEntity',
        `0x1cad798788568098e51c5751fe03a8daa0c7eac6-${dayId}`,
        'beneficiaries',
        '2'
    );

    clearStore();
});
