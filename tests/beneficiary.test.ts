import { clearStore, test, assert } from 'matchstick-as/assembly/index';

import {
    handleBeneficiaryAdded,
    handleBeneficiaryClaim,
} from '../src/mappings/community';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';
import {
    createBeneficiaryAddedEvent,
    createBeneficiaryClaimEvent,
} from './utils/beneficiary';
import { createCommunityAddedEvent } from './utils/community';
import { communityAddress } from './utils/constants';

export { handleBeneficiaryAdded, handleBeneficiaryClaim };

test('add beneficiary', () => {
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

    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        communityAddress[0]
    );

    const beneficiaryAddedEvent2 = createBeneficiaryAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
        communityAddress[0]
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
    // add community
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

    // add beneficiary
    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        communityAddress[0]
    );
    const beneficiaryAddedEvent2 = createBeneficiaryAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
        communityAddress[0]
    );
    handleBeneficiaryAdded(beneficiaryAddedEvent1);
    handleBeneficiaryAdded(beneficiaryAddedEvent2);

    // add claim
    const beneficiaryClaimEvent1 = createBeneficiaryClaimEvent(
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        '5',
        communityAddress[0]
    );
    const beneficiaryClaimEvent2 = createBeneficiaryClaimEvent(
        '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
        '5',
        communityAddress[0]
    );
    handleBeneficiaryClaim(beneficiaryClaimEvent1);
    handleBeneficiaryClaim(beneficiaryClaimEvent2);

    // assert first claims
    assert.fieldEquals(
        'BeneficiaryEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'lastClaimAt',
        beneficiaryClaimEvent1.block.timestamp.toString()
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
        'lastClaimAt',
        beneficiaryClaimEvent2.block.timestamp.toString()
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'preLastClaimAt',
        '0'
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        '0xa0c84e218d5fd3cf903868ceb2f043cc04480bd4',
        'preLastClaimAt',
        '0'
    );

    // assert community data
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'totalClaimed',
        '10'
    );
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'totalBeneficiaries',
        '2'
    );
    clearStore();
});

test('rotate claim timestamp', () => {
    // add community
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

    // add beneficiary
    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        '0x372a0400D646CF5e5e7fED74755EC87bA9D4b135',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        communityAddress[0]
    );
    handleBeneficiaryAdded(beneficiaryAddedEvent1);

    // add claim
    const beneficiaryClaimEvent1 = createBeneficiaryClaimEvent(
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        '5',
        communityAddress[0],
        1640716194
    );
    handleBeneficiaryClaim(beneficiaryClaimEvent1);
    const beneficiaryClaimEvent2 = createBeneficiaryClaimEvent(
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        '5',
        communityAddress[0],
        1640716195
    );
    handleBeneficiaryClaim(beneficiaryClaimEvent2);

    // assert first rotate
    assert.fieldEquals(
        'BeneficiaryEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'lastClaimAt',
        '1640716195'
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'preLastClaimAt',
        '1640716194'
    );

    const beneficiaryClaimEvent3 = createBeneficiaryClaimEvent(
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        '5',
        communityAddress[0],
        1640716196
    );
    handleBeneficiaryClaim(beneficiaryClaimEvent3);

    // assert second rotate
    assert.fieldEquals(
        'BeneficiaryEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'lastClaimAt',
        '1640716196'
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        '0x7110b4df915cb92f53bc01cc9ab15f51e5dbb52f',
        'preLastClaimAt',
        '1640716195'
    );

    clearStore();
});
