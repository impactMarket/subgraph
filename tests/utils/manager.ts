/* global changetype */
import { Address, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import {
    ManagerAdded,
    ManagerRemoved,
} from '../../generated/templates/Community/Community';

export function createManagerAddedEvent(
    manager: string,
    account: string,
    fromCommunityAddress: string
): ManagerAdded {
    const managerAddedEvent = changetype<ManagerAdded>(newMockEvent());
    managerAddedEvent.parameters = [];
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

export function createManagerRemovedEvent(
    manager: string,
    account: string,
    fromCommunityAddress: string
): ManagerRemoved {
    const managerRemovedEvent = changetype<ManagerRemoved>(newMockEvent());
    managerRemovedEvent.parameters = [];
    managerRemovedEvent.address = Address.fromString(fromCommunityAddress);
    const managerParam = new ethereum.EventParam(
        'manager',
        ethereum.Value.fromAddress(Address.fromString(manager))
    );
    const accountParam = new ethereum.EventParam(
        'account',
        ethereum.Value.fromAddress(Address.fromString(account))
    );

    managerRemovedEvent.parameters.push(managerParam);
    managerRemovedEvent.parameters.push(accountParam);

    return managerRemovedEvent;
}
