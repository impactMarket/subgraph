import { BigInt } from '@graphprotocol/graph-ts';
import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import {
    beneficiaryAddress,
    communityAddress,
    communityProps,
    fiveCents,
    managerAddress,
    normalize
} from './utils/constants';
import {
    createBeneficiaryAddedEvent,
    createBeneficiaryClaimEvent,
    createBeneficiaryJoinedEvent,
    createBeneficiaryLockedEvent,
    createBeneficiaryRemovedEvent,
    createBeneficiaryUnlockedEvent
} from './utils/beneficiary';
import { createCommunityAddedEvent } from './utils/community';
import {
    handleBeneficiaryAdded,
    handleBeneficiaryClaim,
    handleBeneficiaryJoined,
    handleBeneficiaryLocked,
    handleBeneficiaryRemoved,
    handleBeneficiaryUnlocked
} from '../src/mappings/community';
import { handleCommunityAdded } from '../src/mappings/communityAdmin';

export {
    handleCommunityAdded,
    handleBeneficiaryAdded,
    handleBeneficiaryRemoved,
    handleBeneficiaryClaim,
    handleBeneficiaryJoined
};

test('should add beneficiary', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

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

    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'address', beneficiaryAddress[0]);
    assert.fieldEquals('ManagerEntity', managerAddress[0], 'added', '2');
    assert.fieldEquals('UserActivityEntity', beneficiaryAddedEvent1.transaction.hash.toHex(), 'activity', 'ADDED');
});

test('should add claim', () => {
    clearStore();

    // add community
    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

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
        communityProps[0].get('claimAmount')!,
        communityAddress[0]
    );
    const beneficiaryClaimEvent2 = createBeneficiaryClaimEvent(
        beneficiaryAddress[1],
        communityProps[0].get('claimAmount')!,
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
    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[1], 'claims', '1');
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[1],
        'claimed',
        normalize(BigInt.fromString(communityProps[0].get('claimAmount')!).toString()).toString()
    );
    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'preLastClaimAt', '0');
    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[1], 'preLastClaimAt', '0');

    // assert community data
    assert.fieldEquals(
        'CommunityEntity',
        communityAddress[0],
        'claimed',
        normalize(
            BigInt.fromString(communityProps[0].get('claimAmount')!)
                .times(BigInt.fromI32(2))
                // two beneficiaries + initial manager
                .plus(fiveCents.times(BigInt.fromI32(3)))
                .toString()
        ).toString()
    );
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'beneficiaries', '2');

    // assert ubi data
    assert.fieldEquals(
        'UBIDailyEntity',
        '0',
        'claimed',
        normalize(
            BigInt.fromString(communityProps[0].get('claimAmount')!)
                .times(BigInt.fromI32(2))
                // two beneficiaries + initial manager
                .plus(fiveCents.times(BigInt.fromI32(3)))
                .toString()
        ).toString()
    );
    assert.fieldEquals('UBIDailyEntity', '0', 'beneficiaries', '2');
});

test('should rotate claim timestamp', () => {
    clearStore();

    // add community
    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

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
        communityProps[0].get('claimAmount')!,
        communityAddress[0],
        1640716194
    );

    handleBeneficiaryClaim(beneficiaryClaimEvent1);
    const beneficiaryClaimEvent2 = createBeneficiaryClaimEvent(
        beneficiaryAddress[0],
        communityProps[0].get('claimAmount')!,
        communityAddress[0],
        1640716195
    );

    handleBeneficiaryClaim(beneficiaryClaimEvent2);

    // assert first rotate
    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'lastClaimAt', '1640716195');
    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'preLastClaimAt', '1640716194');

    const beneficiaryClaimEvent3 = createBeneficiaryClaimEvent(
        beneficiaryAddress[0],
        communityProps[0].get('claimAmount')!,
        communityAddress[0],
        1640716196
    );

    handleBeneficiaryClaim(beneficiaryClaimEvent3);

    // assert second rotate
    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'lastClaimAt', '1640716196');
    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'preLastClaimAt', '1640716195');
    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'claims', '3');
    assert.fieldEquals(
        'BeneficiaryEntity',
        beneficiaryAddress[0],
        'claimed',
        normalize(
            BigInt.fromString(communityProps[0].get('claimAmount')!).times(BigInt.fromI32(3)).toString()
        ).toString()
    );
});

test('should remove beneficiary', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

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

    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'address', beneficiaryAddress[0]);
    assert.fieldEquals('UserActivityEntity', beneficiaryAddedEvent1.transaction.hash.toHex(), 'activity', 'ADDED');
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'beneficiaries', '2');
    assert.fieldEquals('UBIDailyEntity', '0', 'beneficiaries', '2');

    assert.fieldEquals('ManagerEntity', managerAddress[0], 'added', '2');

    const beneficiaryRemovedEvent1 = createBeneficiaryRemovedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    handleBeneficiaryRemoved(beneficiaryRemovedEvent1);

    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'state', '1');
    assert.fieldEquals('UserActivityEntity', beneficiaryRemovedEvent1.transaction.hash.toHex(), 'activity', 'REMOVED');
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'beneficiaries', '1');
    assert.fieldEquals('UBIDailyEntity', '0', 'beneficiaries', '1');

    assert.fieldEquals('ManagerEntity', managerAddress[0], 'added', '2');

    assert.fieldEquals('ManagerEntity', managerAddress[0], 'removed', '1');
});

test('should be able to join migrated community', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    const community2 = createCommunityAddedEvent(communityAddress[1], [managerAddress[1]], communityProps[0]);

    handleCommunityAdded(community);
    handleCommunityAdded(community2);

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

    const beneficiaryJoinedEvent1 = createBeneficiaryJoinedEvent(beneficiaryAddress[0], communityAddress[1]);

    handleBeneficiaryJoined(beneficiaryJoinedEvent1);

    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'community', communityAddress[1]);
    assert.fieldEquals('UBIDailyEntity', '0', 'beneficiaries', '2');

    assert.fieldEquals('ManagerEntity', managerAddress[0], 'added', '2');

    assert.fieldEquals('ManagerEntity', managerAddress[0], 'removed', '0');
});

test('should be able to be added to other community after removed', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    const community2 = createCommunityAddedEvent(communityAddress[1], [managerAddress[1]], communityProps[0]);

    handleCommunityAdded(community);
    handleCommunityAdded(community2);

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

    const beneficiaryRemovedEvent1 = createBeneficiaryRemovedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    handleBeneficiaryRemoved(beneficiaryRemovedEvent1);

    const beneficiaryAddedEvent3 = createBeneficiaryAddedEvent(
        managerAddress[1],
        beneficiaryAddress[0],
        communityAddress[1]
    );

    handleBeneficiaryAdded(beneficiaryAddedEvent3);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'beneficiaries', '1');
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'removedBeneficiaries', '1');
    assert.fieldEquals('CommunityEntity', communityAddress[1], 'beneficiaries', '1');
    assert.fieldEquals('UBIDailyEntity', '0', 'beneficiaries', '2');

    assert.fieldEquals('ManagerEntity', managerAddress[0], 'added', '2');

    assert.fieldEquals('ManagerEntity', managerAddress[0], 'removed', '1');

    assert.fieldEquals('ManagerEntity', managerAddress[1], 'added', '1');
});

test('should be able to be added to the same community after removal', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    handleBeneficiaryAdded(beneficiaryAddedEvent1);

    const beneficiaryRemovedEvent1 = createBeneficiaryRemovedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    handleBeneficiaryRemoved(beneficiaryRemovedEvent1);

    const beneficiaryAddedEvent3 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    handleBeneficiaryAdded(beneficiaryAddedEvent3);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'beneficiaries', '1');
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'removedBeneficiaries', '0');
    assert.fieldEquals('UBIDailyEntity', '0', 'beneficiaries', '1');

    assert.fieldEquals('ManagerEntity', managerAddress[0], 'added', '1');

    assert.fieldEquals('ManagerEntity', managerAddress[0], 'removed', '1');
});

test('should not count same beneficiary twice - alpha issue', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    const beneficiaryAddedEvent2 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    handleBeneficiaryAdded(beneficiaryAddedEvent1);
    handleBeneficiaryAdded(beneficiaryAddedEvent2);

    assert.fieldEquals('CommunityEntity', communityAddress[0], 'beneficiaries', '1');
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'removedBeneficiaries', '0');
    assert.fieldEquals('UBIDailyEntity', '0', 'beneficiaries', '1');
});

test('lock/unlock beneficiary', () => {
    clearStore();

    const community = createCommunityAddedEvent(communityAddress[0], [managerAddress[0]], communityProps[0]);

    handleCommunityAdded(community);

    const beneficiaryAddedEvent1 = createBeneficiaryAddedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    handleBeneficiaryAdded(beneficiaryAddedEvent1);

    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'state', '0');
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'lockedBeneficiaries', '0');

    const lockCommunity = createBeneficiaryLockedEvent(managerAddress[0], beneficiaryAddress[0], communityAddress[0]);

    handleBeneficiaryLocked(lockCommunity);

    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'state', '2');
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'lockedBeneficiaries', '1');

    const unlockCommunity = createBeneficiaryUnlockedEvent(
        managerAddress[0],
        beneficiaryAddress[0],
        communityAddress[0]
    );

    handleBeneficiaryUnlocked(unlockCommunity);

    assert.fieldEquals('BeneficiaryEntity', beneficiaryAddress[0], 'state', '0');
    assert.fieldEquals('CommunityEntity', communityAddress[0], 'lockedBeneficiaries', '0');
});
