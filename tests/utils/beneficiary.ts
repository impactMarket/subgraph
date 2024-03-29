/* global changetype */
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import {
    BeneficiaryAdded,
    BeneficiaryAddressChanged,
    BeneficiaryClaim,
    BeneficiaryCopied,
    BeneficiaryJoined,
    BeneficiaryLocked,
    BeneficiaryRemoved,
    BeneficiaryUnlocked
} from '../../generated/templates/Community/Community';

const addTimestamp: i32 = 1640716190;
// let timestamp: i32 = 1640716193;

export function createBeneficiaryAddedEvent(
    manager: string,
    beneficiary: string,
    fromCommunityAddress: string
): BeneficiaryAdded {
    const beneficiaryAddedEvent = changetype<BeneficiaryAdded>(newMockEvent());

    beneficiaryAddedEvent.parameters = [];
    beneficiaryAddedEvent.address = Address.fromString(fromCommunityAddress);
    beneficiaryAddedEvent.block.timestamp = BigInt.fromI32(addTimestamp);
    const managerParam = new ethereum.EventParam('manager', ethereum.Value.fromAddress(Address.fromString(manager)));
    const beneficiaryParam = new ethereum.EventParam(
        'beneficiary',
        ethereum.Value.fromAddress(Address.fromString(beneficiary))
    );

    beneficiaryAddedEvent.parameters.push(managerParam);
    beneficiaryAddedEvent.parameters.push(beneficiaryParam);

    return beneficiaryAddedEvent;
}

export function createBeneficiaryRemovedEvent(
    manager: string,
    beneficiary: string,
    fromCommunityAddress: string
): BeneficiaryRemoved {
    const beneficiaryRemovedEvent = changetype<BeneficiaryRemoved>(newMockEvent());

    beneficiaryRemovedEvent.parameters = [];
    beneficiaryRemovedEvent.address = Address.fromString(fromCommunityAddress);
    beneficiaryRemovedEvent.block.timestamp = BigInt.fromI32(addTimestamp);
    const managerParam = new ethereum.EventParam('manager', ethereum.Value.fromAddress(Address.fromString(manager)));
    const beneficiaryParam = new ethereum.EventParam(
        'beneficiary',
        ethereum.Value.fromAddress(Address.fromString(beneficiary))
    );

    beneficiaryRemovedEvent.parameters.push(managerParam);
    beneficiaryRemovedEvent.parameters.push(beneficiaryParam);

    return beneficiaryRemovedEvent;
}

export function createBeneficiaryJoinedEvent(beneficiary: string, communityAddress: string): BeneficiaryJoined {
    const beneficiaryJoinedEvent = changetype<BeneficiaryJoined>(newMockEvent());

    beneficiaryJoinedEvent.parameters = [];
    beneficiaryJoinedEvent.address = Address.fromString(communityAddress);
    beneficiaryJoinedEvent.block.timestamp = BigInt.fromI32(addTimestamp);
    const beneficiaryParam = new ethereum.EventParam(
        'beneficiary',
        ethereum.Value.fromAddress(Address.fromString(beneficiary))
    );

    beneficiaryJoinedEvent.parameters.push(beneficiaryParam);

    return beneficiaryJoinedEvent;
}

export function createBeneficiaryClaimEvent(
    beneficiary: string,
    amount: string,
    fromCommunityAddress: string,
    timestamp: i32 = 1640716193
): BeneficiaryClaim {
    const beneficiaryClaimEvent = changetype<BeneficiaryClaim>(newMockEvent());

    beneficiaryClaimEvent.parameters = [];
    beneficiaryClaimEvent.address = Address.fromString(fromCommunityAddress);
    // timestamp++;
    beneficiaryClaimEvent.block.timestamp = BigInt.fromI32(timestamp);
    const beneficiaryParam = new ethereum.EventParam(
        'beneficiary',
        ethereum.Value.fromAddress(Address.fromString(beneficiary))
    );
    const amountParam = new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(BigInt.fromString(amount)));

    beneficiaryClaimEvent.parameters.push(beneficiaryParam);
    beneficiaryClaimEvent.parameters.push(amountParam);

    return beneficiaryClaimEvent;
}

export function createBeneficiaryLockedEvent(
    manager: string,
    beneficiary: string,
    communityAddress: string
): BeneficiaryLocked {
    const beneficaryLockedEvent = changetype<BeneficiaryLocked>(newMockEvent());

    beneficaryLockedEvent.parameters = [];
    beneficaryLockedEvent.address = Address.fromString(communityAddress);
    const managerParam = new ethereum.EventParam('manager', ethereum.Value.fromAddress(Address.fromString(manager)));
    const beneficiaryParam = new ethereum.EventParam(
        'beneficiary',
        ethereum.Value.fromAddress(Address.fromString(beneficiary))
    );

    beneficaryLockedEvent.parameters.push(managerParam);
    beneficaryLockedEvent.parameters.push(beneficiaryParam);

    return beneficaryLockedEvent;
}

export function createBeneficiaryUnlockedEvent(
    manager: string,
    beneficiary: string,
    communityAddress: string
): BeneficiaryUnlocked {
    const beneficiaryUnlockedEvent = changetype<BeneficiaryUnlocked>(newMockEvent());

    beneficiaryUnlockedEvent.parameters = [];
    beneficiaryUnlockedEvent.address = Address.fromString(communityAddress);
    const managerParam = new ethereum.EventParam('manager', ethereum.Value.fromAddress(Address.fromString(manager)));
    const beneficiaryParam = new ethereum.EventParam(
        'beneficiary',
        ethereum.Value.fromAddress(Address.fromString(beneficiary))
    );

    beneficiaryUnlockedEvent.parameters.push(managerParam);
    beneficiaryUnlockedEvent.parameters.push(beneficiaryParam);

    return beneficiaryUnlockedEvent;
}

export function createBeneficiaryAddressChangedEvent(
    beneficiary1: string,
    beneficiary2: string,
    communityAddress: string
): BeneficiaryAddressChanged {
    const beneficiaryAddressChangedEvent = changetype<BeneficiaryAddressChanged>(newMockEvent());

    beneficiaryAddressChangedEvent.parameters = [];
    beneficiaryAddressChangedEvent.address = Address.fromString(communityAddress);
    const beneficiary1Param = new ethereum.EventParam(
        'beneficiary1',
        ethereum.Value.fromAddress(Address.fromString(beneficiary1))
    );
    const beneficiary2Param = new ethereum.EventParam(
        'beneficiary2',
        ethereum.Value.fromAddress(Address.fromString(beneficiary2))
    );

    beneficiaryAddressChangedEvent.parameters.push(beneficiary1Param);
    beneficiaryAddressChangedEvent.parameters.push(beneficiary2Param);

    return beneficiaryAddressChangedEvent;
}

export function createBeneficiaryCopiedEvent(
    manager: string,
    beneficiary: string,
    communityAddress: string
): BeneficiaryCopied {
    const beneficiaryCopiedEvent = changetype<BeneficiaryCopied>(newMockEvent());

    beneficiaryCopiedEvent.parameters = [];
    beneficiaryCopiedEvent.address = Address.fromString(communityAddress);
    const managerParam = new ethereum.EventParam('manager', ethereum.Value.fromAddress(Address.fromString(manager)));
    const beneficiaryParam = new ethereum.EventParam(
        'beneficiary',
        ethereum.Value.fromAddress(Address.fromString(beneficiary))
    );

    beneficiaryCopiedEvent.parameters.push(managerParam);
    beneficiaryCopiedEvent.parameters.push(beneficiaryParam);

    return beneficiaryCopiedEvent;
}
