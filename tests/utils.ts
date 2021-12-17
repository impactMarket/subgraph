import { Address, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import { CommunityAdded } from '../generated/CommunityAdmin/CommunityAdmin';
import { ManagerAdded } from '../generated/templates/Community/Community';

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
    account: string,
    manager: string,
    fromCommunityAddress: string
): ManagerAdded {
    const managerAddedEvent = changetype<ManagerAdded>(newMockEvent());
    managerAddedEvent.parameters = new Array();
    managerAddedEvent.address = Address.fromString(fromCommunityAddress);
    const accountParam = new ethereum.EventParam(
        'account',
        ethereum.Value.fromAddress(Address.fromString(account))
    );
    const managerParam = new ethereum.EventParam(
        'manager',
        ethereum.Value.fromAddress(Address.fromString(manager))
    );

    managerAddedEvent.parameters.push(accountParam);
    managerAddedEvent.parameters.push(managerParam);

    return managerAddedEvent;
}
