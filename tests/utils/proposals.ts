/* global changetype */
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import {
    ProposalCreated,
    ProposalQueued
} from '../../generated/PACTDelegator/PACTDelegator';

export function createProposalCreatedEvent(
    id: i32,
    proposer: string,
    targets: string[],
    values: i32[],
    signatures: string[],
    calldatas: string[],
    startBlock: i32,
    endBlock: i32,
    description: string
): ProposalCreated {
    const proposalCreatedEvent = changetype<ProposalCreated>(newMockEvent());

    proposalCreatedEvent.parameters = [];
    const idParam = new ethereum.EventParam(
        'id',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(id))
    );
    const proposerParam = new ethereum.EventParam(
        'proposer',
        ethereum.Value.fromAddress(Address.fromString(proposer))
    );
    const _targets: Address[] = [];

    for (let index = 0; index < targets.length; index++) {
        _targets.push(Address.fromString(targets[index]));
    }
    const targetsParam = new ethereum.EventParam(
        'targets',
        ethereum.Value.fromAddressArray(_targets)
    );
    const _values: BigInt[] = [];

    for (let index = 0; index < values.length; index++) {
        _values.push(BigInt.fromI32(values[index]));
    }
    const valuesParam = new ethereum.EventParam(
        'values',
        ethereum.Value.fromUnsignedBigIntArray(_values)
    );
    const signaturesParam = new ethereum.EventParam(
        'signatures',
        ethereum.Value.fromStringArray(signatures)
    );
    const _calldatas: Bytes[] = [];

    for (let index = 0; index < calldatas.length; index++) {
        _calldatas.push(
            Bytes.fromByteArray(Bytes.fromHexString(calldatas[index]))
        );
    }
    const calldatasParam = new ethereum.EventParam(
        'calldatas',
        ethereum.Value.fromBytesArray(_calldatas)
    );
    const startBlockParam = new ethereum.EventParam(
        'startBlock',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(startBlock))
    );
    const endBlockParam = new ethereum.EventParam(
        'endBlock',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(endBlock))
    );
    const descriptionParam = new ethereum.EventParam(
        'description',
        ethereum.Value.fromString(description)
    );

    proposalCreatedEvent.parameters.push(idParam);
    proposalCreatedEvent.parameters.push(proposerParam);
    proposalCreatedEvent.parameters.push(targetsParam);
    proposalCreatedEvent.parameters.push(valuesParam);
    proposalCreatedEvent.parameters.push(signaturesParam);
    proposalCreatedEvent.parameters.push(calldatasParam);
    proposalCreatedEvent.parameters.push(startBlockParam);
    proposalCreatedEvent.parameters.push(endBlockParam);
    proposalCreatedEvent.parameters.push(descriptionParam);

    return proposalCreatedEvent;
}

export function createProposalQueuedEvent(id: i32): ProposalQueued {
    const proposalCreatedEvent = changetype<ProposalQueued>(newMockEvent());

    proposalCreatedEvent.parameters = [];
    const idParam = new ethereum.EventParam(
        'id',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(id))
    );
    const etaParam = new ethereum.EventParam(
        'eta',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
    );

    proposalCreatedEvent.parameters.push(idParam);
    proposalCreatedEvent.parameters.push(etaParam);

    return proposalCreatedEvent;
}
