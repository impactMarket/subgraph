/* global changetype */
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import {
    ProposalCanceled,
    ProposalCreated1,
    ProposalExecuted,
    VoteCast
} from '../../generated/ImpactMarketCouncil/ImpactMarketCouncil';

export function createProposalCreatedEvent(
    id: i32,
    proposer: string,
    targets: string[],
    signatures: string[],
    calldatas: string[],
    endBlock: i32,
    description: string
): ProposalCreated1 {
    const proposalCreatedEvent = changetype<ProposalCreated1>(newMockEvent());

    proposalCreatedEvent.parameters = [];
    const idParam = new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(id)));
    const proposerParam = new ethereum.EventParam('proposer', ethereum.Value.fromAddress(Address.fromString(proposer)));
    const signaturesParam = new ethereum.EventParam('signatures', ethereum.Value.fromStringArray(signatures));
    const _targets: Address[] = [];

    for (let index = 0; index < targets.length; index++) {
        _targets.push(Address.fromString(targets[index]));
    }
    const targetsParam = new ethereum.EventParam('targets', ethereum.Value.fromAddressArray(_targets));
    const _calldatas: Bytes[] = [];

    for (let index = 0; index < calldatas.length; index++) {
        _calldatas.push(Bytes.fromByteArray(Bytes.fromHexString(calldatas[index])));
    }
    const calldatasParam = new ethereum.EventParam('calldatas', ethereum.Value.fromBytesArray(_calldatas));
    const endBlockParam = new ethereum.EventParam(
        'endBlock',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(endBlock))
    );
    const descriptionParam = new ethereum.EventParam('description', ethereum.Value.fromString(description));

    proposalCreatedEvent.parameters.push(idParam);
    proposalCreatedEvent.parameters.push(proposerParam);
    proposalCreatedEvent.parameters.push(targetsParam);
    proposalCreatedEvent.parameters.push(signaturesParam);
    proposalCreatedEvent.parameters.push(calldatasParam);
    proposalCreatedEvent.parameters.push(endBlockParam);
    proposalCreatedEvent.parameters.push(descriptionParam);

    return proposalCreatedEvent;
}

export function createProposalCanceledEvent(id: i32): ProposalCanceled {
    const proposalCanceledEvent = changetype<ProposalCanceled>(newMockEvent());

    proposalCanceledEvent.parameters = [];
    const idParam = new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(id)));

    proposalCanceledEvent.parameters.push(idParam);

    return proposalCanceledEvent;
}

export function createProposalExecutedEvent(id: i32): ProposalExecuted {
    const proposalExecutedEvent = changetype<ProposalExecuted>(newMockEvent());

    proposalExecutedEvent.parameters = [];
    const idParam = new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(id)));

    proposalExecutedEvent.parameters.push(idParam);

    return proposalExecutedEvent;
}

export function createVoteCastEvent(
    voter: string,
    proposalId: i32,
    support: i32,
    votes: i32,
    reason: string
): VoteCast {
    const voteCastEvent = changetype<VoteCast>(newMockEvent());

    voteCastEvent.parameters = [];
    const voterParam = new ethereum.EventParam('voter', ethereum.Value.fromAddress(Address.fromString(voter)));
    const proposalIdParam = new ethereum.EventParam(
        'proposalId',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(proposalId))
    );
    const supportParam = new ethereum.EventParam('support', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(support)));
    const votesParam = new ethereum.EventParam('votes', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(votes)));
    const reasonParam = new ethereum.EventParam('reason', ethereum.Value.fromString(reason));

    voteCastEvent.parameters.push(voterParam);
    voteCastEvent.parameters.push(proposalIdParam);
    voteCastEvent.parameters.push(supportParam);
    voteCastEvent.parameters.push(votesParam);
    voteCastEvent.parameters.push(reasonParam);

    return voteCastEvent;
}
