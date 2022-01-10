import { BigInt } from '@graphprotocol/graph-ts';
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
import {
    beneficiaryAddress,
    communityAddress,
    communityProps,
    fiveCents,
    managerAddress,
} from './utils/constants';

export { handleCommunityAdded, handleBeneficiaryAdded, handleBeneficiaryClaim };

test('add beneficiary', () => {
    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );

    handleCommunityAdded(community);

    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    const beneficiaryAddedEvent2 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[1],
        communityAddress[0]
    );

    handleBeneficiaryAdded(beneficiaryAddedEvent1);
    handleBeneficiaryAdded(beneficiaryAddedEvent2);

    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[0],
        'address',
        beneficiaryAddress[0]
    );

    assert.fieldEquals(
        'UserActivityEntity',
        beneficiaryAddedEvent1.transaction.hash.toHex(),
        'activity',
        'added'
    );

    clearStore();
});

test('add claim', () => {
    // add community
    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );
    handleCommunityAdded(community);

    // add beneficiary
    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );
    const beneficiaryAddedEvent2 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[1],
        communityAddress[0]
    );
    handleBeneficiaryAdded(beneficiaryAddedEvent1);
    handleBeneficiaryAdded(beneficiaryAddedEvent2);

    // add claim
    const beneficiaryClaimEvent1 = createBeneficiaryClaimEvent(
        beneficiaryAddress[0],
        communityProps[0].get('claimAmount'),
        communityAddress[0]
    );
    const beneficiaryClaimEvent2 = createBeneficiaryClaimEvent(
        beneficiaryAddress[1],
        communityProps[0].get('claimAmount'),
        communityAddress[0]
    );
    handleBeneficiaryClaim(beneficiaryClaimEvent1);
    handleBeneficiaryClaim(beneficiaryClaimEvent2);

    // assert first claims
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[0],
        'lastClaimAt',
        beneficiaryClaimEvent1.block.timestamp.toString()
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[1],
        'lastClaimAt',
        beneficiaryClaimEvent2.block.timestamp.toString()
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[0],
        'preLastClaimAt',
        '0'
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[1],
        'preLastClaimAt',
        '0'
    );

    // assert community data
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'claimed',
        BigInt.fromString(communityProps[0].get('claimAmount'))
            .times(BigInt.fromI32(2))
            .plus(fiveCents.times(BigInt.fromI32(2)))
            .toString()
    );
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'beneficiaries',
        '2'
    );

    // assert ubi data
    assert.fieldEquals(
        'UBIEntity',
        '0',
        'claimed',
        BigInt.fromString(communityProps[0].get('claimAmount'))
            .times(BigInt.fromI32(2))
            .plus(fiveCents.times(BigInt.fromI32(2)))
            .toString()
    );
    assert.fieldEquals('UBIEntity', '0', 'beneficiaries', '2');
    clearStore();
});

test('rotate claim timestamp', () => {
    // add community
    const community = createCommunityAddedEvent(
        communityAddress[0],
        [managerAddress[0]],
        communityProps[0]
    );
    handleCommunityAdded(community);

    // add beneficiary
    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );
    handleBeneficiaryAdded(beneficiaryAddedEvent1);

    // add claim
    const beneficiaryClaimEvent1 = createBeneficiaryClaimEvent(
        beneficiaryAddress[0],
        communityProps[0].get('claimAmount'),
        communityAddress[0],
        1640716194
    );
    handleBeneficiaryClaim(beneficiaryClaimEvent1);
    const beneficiaryClaimEvent2 = createBeneficiaryClaimEvent(
        beneficiaryAddress[0],
        communityProps[0].get('claimAmount'),
        communityAddress[0],
        1640716195
    );
    handleBeneficiaryClaim(beneficiaryClaimEvent2);

    // assert first rotate
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[0],
        'lastClaimAt',
        '1640716195'
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[0],
        'preLastClaimAt',
        '1640716194'
    );

    const beneficiaryClaimEvent3 = createBeneficiaryClaimEvent(
        beneficiaryAddress[0],
        communityProps[0].get('claimAmount'),
        communityAddress[0],
        1640716196
    );
    handleBeneficiaryClaim(beneficiaryClaimEvent3);

    // assert second rotate
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[0],
        'lastClaimAt',
        '1640716196'
    );
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[0],
        'preLastClaimAt',
        '1640716195'
    );

    clearStore();
});

// TODO: test remove beneficiary
// TODO: test beneficiary joined
// TODO: test beneficiary beind added on another community
