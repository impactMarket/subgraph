/* global changetype */
import { Address, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

import { MemberAdded, MemberRemoved } from '../../generated/ImpactMarketCouncil/ImpactMarketCouncil';

export function createMemberAddedEvent(member: string): MemberAdded {
    const memberAddedEvent = changetype<MemberAdded>(newMockEvent());

    memberAddedEvent.parameters = [];
    const memberParam = new ethereum.EventParam('member', ethereum.Value.fromAddress(Address.fromString(member)));

    memberAddedEvent.parameters.push(memberParam);

    return memberAddedEvent;
}

export function createMemberRemovedEvent(member: string): MemberRemoved {
    const memberRemovedEvent = changetype<MemberRemoved>(newMockEvent());

    memberRemovedEvent.parameters = [];
    const memberParam = new ethereum.EventParam('member', ethereum.Value.fromAddress(Address.fromString(member)));

    memberRemovedEvent.parameters.push(memberParam);

    return memberRemovedEvent;
}
