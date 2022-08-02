/* global changetype */
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import { ManagerAdded, ManagerRemoved } from '../../generated/templates/Community/Community';

export function createManagerAddedEvent(
    by: string,
    manager: string,
    fromCommunityAddress: string,
    timestamp: i32 = 0
): ManagerAdded {
    const managerAddedEvent = changetype<ManagerAdded>(newMockEvent());

    managerAddedEvent.parameters = [];
    if (timestamp !== 0) {
        managerAddedEvent.block.timestamp = BigInt.fromI32(timestamp);
    }
    managerAddedEvent.address = Address.fromString(fromCommunityAddress);
    const byParam = new ethereum.EventParam('manager', ethereum.Value.fromAddress(Address.fromString(by)));
    const managerParam = new ethereum.EventParam('account', ethereum.Value.fromAddress(Address.fromString(manager)));

    managerAddedEvent.parameters.push(byParam);
    managerAddedEvent.parameters.push(managerParam);

    return managerAddedEvent;
}

export function createManagerRemovedEvent(
    by: string,
    manager: string,
    fromCommunityAddress: string,
    timestamp: i32 = 0
): ManagerRemoved {
    const managerRemovedEvent = changetype<ManagerRemoved>(newMockEvent());

    managerRemovedEvent.parameters = [];
    if (timestamp !== 0) {
        managerRemovedEvent.block.timestamp = BigInt.fromI32(timestamp);
    }
    managerRemovedEvent.address = Address.fromString(fromCommunityAddress);
    const byParam = new ethereum.EventParam('manager', ethereum.Value.fromAddress(Address.fromString(by)));
    const managerParam = new ethereum.EventParam('account', ethereum.Value.fromAddress(Address.fromString(manager)));

    managerRemovedEvent.parameters.push(byParam);
    managerRemovedEvent.parameters.push(managerParam);

    return managerRemovedEvent;
}
