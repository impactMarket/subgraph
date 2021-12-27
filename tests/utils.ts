import { Address, ethereum, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import { CommunityAdded } from '../generated/CommunityAdmin/CommunityAdmin';
import {
    ProposalCreated,
    ProposalQueued,
} from '../generated/PACTDelegator/PACTDelegator';
import {
    BeneficiaryAdded,
    BeneficiaryClaim,
    ManagerAdded,
} from '../generated/templates/Community/Community';

export function createCommunityAddedEvent(
    communityAddress: string,
    managers: string[],
    claimAmount: string,
    maxClaim: string,
    decreaseStep: string,
    baseInterval: string,
    incrementInterval: string,
    minTranche: string,
    maxTranche: string
): CommunityAdded {
    const communityAddedEvent = changetype<CommunityAdded>(newMockEvent());
    communityAddedEvent.parameters = new Array();
    const communityAddressParam = new ethereum.EventParam(
        'communityAddress',
        ethereum.Value.fromAddress(Address.fromString(communityAddress))
    );
    const managersParam = new ethereum.EventParam(
        'managers',
        ethereum.Value.fromAddressArray([Address.fromString(managers[0])])
    );
    const claimAmountParam = new ethereum.EventParam(
        'claimAmount',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(claimAmount))
    );
    const maxClaimParam = new ethereum.EventParam(
        'maxClaim',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(maxClaim))
    );
    const decreaseStepParam = new ethereum.EventParam(
        'decreaseStep',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(decreaseStep))
    );
    const baseIntervalParam = new ethereum.EventParam(
        'baseInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(baseInterval))
    );
    const incrementIntervalParam = new ethereum.EventParam(
        'incrementInterval',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(incrementInterval))
    );
    const minTrancheParam = new ethereum.EventParam(
        'minTranche',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(minTranche))
    );
    const maxTrancheParam = new ethereum.EventParam(
        'maxTranche',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(maxTranche))
    );

    communityAddedEvent.parameters.push(communityAddressParam);
    communityAddedEvent.parameters.push(managersParam);
    communityAddedEvent.parameters.push(claimAmountParam);
    communityAddedEvent.parameters.push(maxClaimParam);
    communityAddedEvent.parameters.push(decreaseStepParam);
    communityAddedEvent.parameters.push(baseIntervalParam);
    communityAddedEvent.parameters.push(incrementIntervalParam);
    communityAddedEvent.parameters.push(minTrancheParam);
    communityAddedEvent.parameters.push(maxTrancheParam);

    return communityAddedEvent;
}

export function createManagerAddedEvent(
    manager: string,
    account: string,
    fromCommunityAddress: string
): ManagerAdded {
    const managerAddedEvent = changetype<ManagerAdded>(newMockEvent());
    managerAddedEvent.parameters = new Array();
    managerAddedEvent.address = Address.fromString(fromCommunityAddress);
    const managerParam = new ethereum.EventParam(
        'manager',
        ethereum.Value.fromAddress(Address.fromString(manager))
    );
    const accountParam = new ethereum.EventParam(
        'account',
        ethereum.Value.fromAddress(Address.fromString(account))
    );

    managerAddedEvent.parameters.push(managerParam);
    managerAddedEvent.parameters.push(accountParam);

    return managerAddedEvent;
}

export function createBeneficiaryAddedEvent(
    manager: string,
    beneficiary: string,
    fromCommunityAddress: string
): BeneficiaryAdded {
    const beneficiaryAddedEvent = changetype<BeneficiaryAdded>(newMockEvent());
    beneficiaryAddedEvent.parameters = new Array();
    beneficiaryAddedEvent.address = Address.fromString(fromCommunityAddress);
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
    fromCommunityAddress: string
): BeneficiaryClaim {
    const beneficiaryClaimEvent = changetype<BeneficiaryClaim>(newMockEvent());
    beneficiaryClaimEvent.parameters = new Array();
    beneficiaryClaimEvent.address = Address.fromString(fromCommunityAddress);
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
    proposalCreatedEvent.parameters = new Array();
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
    proposalCreatedEvent.parameters = new Array();
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
