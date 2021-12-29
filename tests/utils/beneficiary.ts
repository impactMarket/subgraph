import { Address, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import {
    BeneficiaryAdded,
    BeneficiaryClaim,
} from '../../generated/templates/Community/Community';

let addTimestamp: i32 = 1640716190;
// let timestamp: i32 = 1640716193;

export function createBeneficiaryAddedEvent(
    manager: string,
    beneficiary: string,
    fromCommunityAddress: string
): BeneficiaryAdded {
    const beneficiaryAddedEvent = changetype<BeneficiaryAdded>(newMockEvent());
    beneficiaryAddedEvent.parameters = new Array();
    beneficiaryAddedEvent.address = Address.fromString(fromCommunityAddress);
    beneficiaryAddedEvent.block.timestamp = BigInt.fromI32(addTimestamp);
    const managerParam = new ethereum.EventParam(
        'manager',
        ethereum.Value.fromAddress(Address.fromString(manager))
    );
    const beneficiaryParam = new ethereum.EventParam(
        'beneficiary',
        ethereum.Value.fromAddress(Address.fromString(beneficiary))
    );

    beneficiaryAddedEvent.parameters.push(managerParam);
    beneficiaryAddedEvent.parameters.push(beneficiaryParam);

    return beneficiaryAddedEvent;
}

export function createBeneficiaryClaimEvent(
    beneficiary: string,
    amount: string,
    fromCommunityAddress: string,
    timestamp: i32 = 1640716193
): BeneficiaryClaim {
    const beneficiaryClaimEvent = changetype<BeneficiaryClaim>(newMockEvent());
    beneficiaryClaimEvent.parameters = new Array();
    beneficiaryClaimEvent.address = Address.fromString(fromCommunityAddress);
    // timestamp++;
    beneficiaryClaimEvent.block.timestamp = BigInt.fromI32(timestamp);
    const beneficiaryParam = new ethereum.EventParam(
        'beneficiary',
        ethereum.Value.fromAddress(Address.fromString(beneficiary))
    );
    const amountParam = new ethereum.EventParam(
        'amount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(amount))
    );

    beneficiaryClaimEvent.parameters.push(beneficiaryParam);
    beneficiaryClaimEvent.parameters.push(amountParam);

    return beneficiaryClaimEvent;
}
