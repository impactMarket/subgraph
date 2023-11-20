/* global changetype */
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
    AmbassadorAccountReplaced,
    AmbassadorAdded,
    AmbassadorRemoved,
    AmbassadorReplaced,
    AmbassadorToCommunityUpdated,
    AmbassadorTransfered,
    CommunityRemoved,
    EntityAccountReplaced,
    EntityAdded,
    EntityRemoved
} from '../../generated/Ambassadors/Ambassadors';
import { newMockEvent } from 'matchstick-as/assembly/defaults';

// event EntityAdded(address indexed entity);
export function createEntityAddedEvent(entity: string): EntityAdded {
    const entityAddedEvent = changetype<EntityAdded>(newMockEvent());

    entityAddedEvent.parameters = [];
    const addressParam = new ethereum.EventParam('entity', ethereum.Value.fromAddress(Address.fromString(entity)));

    entityAddedEvent.parameters.push(addressParam);

    return entityAddedEvent;
}

// event EntityRemoved(address indexed entity);
export function createEntityRemovedEvent(entity: string): EntityRemoved {
    const entityRemovedEvent = changetype<EntityRemoved>(newMockEvent());

    entityRemovedEvent.parameters = [];
    const addressParam = new ethereum.EventParam('entity', ethereum.Value.fromAddress(Address.fromString(entity)));

    entityRemovedEvent.parameters.push(addressParam);

    return entityRemovedEvent;
}

// event EntityAccountReplaced(
//     uint256 entityIndex,
//     address indexed oldAccount,
//     address indexed newAccount
// );
export function createEntityAccountReplacedEvent(
    entityIndex: i32,
    oldAccount: string,
    newAccount: string
): EntityAccountReplaced {
    const entityAccountReplacedEvent = changetype<EntityAccountReplaced>(newMockEvent());

    entityAccountReplacedEvent.parameters = [];
    const entityIndexParam = new ethereum.EventParam(
        'entityIndex',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(entityIndex))
    );
    const oldAccountParam = new ethereum.EventParam(
        'oldAccount',
        ethereum.Value.fromAddress(Address.fromString(oldAccount))
    );
    const newAccountParam = new ethereum.EventParam(
        'newAccount',
        ethereum.Value.fromAddress(Address.fromString(newAccount))
    );

    entityAccountReplacedEvent.parameters.push(entityIndexParam);
    entityAccountReplacedEvent.parameters.push(oldAccountParam);
    entityAccountReplacedEvent.parameters.push(newAccountParam);

    return entityAccountReplacedEvent;
}

// event AmbassadorAdded(address indexed ambassador, address indexed entity);
export function createAmbassadorAddedEvent(ambassador: string, entity: string): AmbassadorAdded {
    const ambassadorAddedEvent = changetype<AmbassadorAdded>(newMockEvent());

    ambassadorAddedEvent.parameters = [];
    const ambassadorParam = new ethereum.EventParam(
        'ambassador',
        ethereum.Value.fromAddress(Address.fromString(ambassador))
    );
    const entityParam = new ethereum.EventParam('entity', ethereum.Value.fromAddress(Address.fromString(entity)));

    ambassadorAddedEvent.parameters.push(ambassadorParam);
    ambassadorAddedEvent.parameters.push(entityParam);

    return ambassadorAddedEvent;
}

// event AmbassadorRemoved(address indexed ambassador, address indexed entity);
export function createAmbassadorRemovedEvent(ambassador: string, entity: string): AmbassadorRemoved {
    const ambassadorRemovedEvent = changetype<AmbassadorRemoved>(newMockEvent());

    ambassadorRemovedEvent.parameters = [];
    const ambassadorParam = new ethereum.EventParam(
        'ambassador',
        ethereum.Value.fromAddress(Address.fromString(ambassador))
    );
    const entityParam = new ethereum.EventParam('entity', ethereum.Value.fromAddress(Address.fromString(entity)));

    ambassadorRemovedEvent.parameters.push(ambassadorParam);
    ambassadorRemovedEvent.parameters.push(entityParam);

    return ambassadorRemovedEvent;
}

// event AmbassadorAccountReplaced(
//     uint256 ambassadorIndex,
//     address indexed entityAccount,
//     address indexed oldAccount,
//     address indexed newAccount
// );
export function createAmbassadorAccountReplacedEvent(
    ambassadorIndex: i32,
    entityAccount: string,
    oldAccount: string,
    newAccount: string
): AmbassadorAccountReplaced {
    const ambassadorAccountReplacedEvent = changetype<AmbassadorAccountReplaced>(newMockEvent());

    ambassadorAccountReplacedEvent.parameters = [];
    const ambassadorIndexParam = new ethereum.EventParam(
        'ambassadorIndex',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(ambassadorIndex))
    );
    const entityAccountParam = new ethereum.EventParam(
        'entityAccount',
        ethereum.Value.fromAddress(Address.fromString(entityAccount))
    );
    const oldAccountParam = new ethereum.EventParam(
        'oldAccount',
        ethereum.Value.fromAddress(Address.fromString(oldAccount))
    );
    const newAccountParam = new ethereum.EventParam(
        'newAccount',
        ethereum.Value.fromAddress(Address.fromString(newAccount))
    );

    ambassadorAccountReplacedEvent.parameters.push(ambassadorIndexParam);
    ambassadorAccountReplacedEvent.parameters.push(entityAccountParam);
    ambassadorAccountReplacedEvent.parameters.push(oldAccountParam);
    ambassadorAccountReplacedEvent.parameters.push(newAccountParam);

    return ambassadorAccountReplacedEvent;
}

// event AmbassadorReplaced(
//     uint256 ambassadorIndex,
//     address indexed entityAccount,
//     address indexed oldAmbassador,
//     address indexed newAmbassador
// );
export function createAmbassadorReplacedEvent(
    ambassadorIndex: i32,
    entityAccount: string,
    oldAmbassador: string,
    newAmbassador: string
): AmbassadorReplaced {
    const ambassadorReplacedEvent = changetype<AmbassadorReplaced>(newMockEvent());

    ambassadorReplacedEvent.parameters = [];
    const ambassadorIndexParam = new ethereum.EventParam(
        'ambassadorIndex',
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(ambassadorIndex))
    );
    const entityAccountParam = new ethereum.EventParam(
        'entityAccount',
        ethereum.Value.fromAddress(Address.fromString(entityAccount))
    );
    const oldAmbassadorParam = new ethereum.EventParam(
        'oldAmbassador',
        ethereum.Value.fromAddress(Address.fromString(oldAmbassador))
    );
    const newAmbassadorParam = new ethereum.EventParam(
        'newAmbassador',
        ethereum.Value.fromAddress(Address.fromString(newAmbassador))
    );

    ambassadorReplacedEvent.parameters.push(ambassadorIndexParam);
    ambassadorReplacedEvent.parameters.push(entityAccountParam);
    ambassadorReplacedEvent.parameters.push(oldAmbassadorParam);
    ambassadorReplacedEvent.parameters.push(newAmbassadorParam);

    return ambassadorReplacedEvent;
}

// event AmbassadorTransfered(
//     address indexed ambassador,
//     address indexed oldEntity,
//     address indexed newEntity
// );
export function createAmbassadorTransferedEvent(
    ambassador: string,
    oldEntity: string,
    newEntity: string
): AmbassadorTransfered {
    const ambassadorTransferedEvent = changetype<AmbassadorTransfered>(newMockEvent());

    ambassadorTransferedEvent.parameters = [];
    const ambassadorParam = new ethereum.EventParam(
        'ambassador',
        ethereum.Value.fromAddress(Address.fromString(ambassador))
    );
    const oldEntityParam = new ethereum.EventParam(
        'oldEntity',
        ethereum.Value.fromAddress(Address.fromString(oldEntity))
    );
    const newEntityParam = new ethereum.EventParam(
        'newEntity',
        ethereum.Value.fromAddress(Address.fromString(newEntity))
    );

    ambassadorTransferedEvent.parameters.push(ambassadorParam);
    ambassadorTransferedEvent.parameters.push(oldEntityParam);
    ambassadorTransferedEvent.parameters.push(newEntityParam);

    return ambassadorTransferedEvent;
}

// event AmbassadorToCommunityUpdated(
//     address indexed fromAmbassador,
//     address indexed toAmbassador,
//     address indexed community
// );
export function createAmbassadorToCommunityUpdatedEvent(
    fromAmbassador: string,
    toAmbassador: string,
    community: string
): AmbassadorToCommunityUpdated {
    const ambassadorToCommunityUpdatedEvent = changetype<AmbassadorToCommunityUpdated>(newMockEvent());

    ambassadorToCommunityUpdatedEvent.parameters = [];
    const fromAmbassadorParam = new ethereum.EventParam(
        'fromAmbassador',
        ethereum.Value.fromAddress(Address.fromString(fromAmbassador))
    );
    const toAmbassadorParam = new ethereum.EventParam(
        'toAmbassador',
        ethereum.Value.fromAddress(Address.fromString(toAmbassador))
    );
    const communityParam = new ethereum.EventParam(
        'community',
        ethereum.Value.fromAddress(Address.fromString(community))
    );

    ambassadorToCommunityUpdatedEvent.parameters.push(fromAmbassadorParam);
    ambassadorToCommunityUpdatedEvent.parameters.push(toAmbassadorParam);
    ambassadorToCommunityUpdatedEvent.parameters.push(communityParam);

    return ambassadorToCommunityUpdatedEvent;
}

// event CommunityRemoved(address indexed ambassador, address indexed community);
export function createCommunityRemovedEvent(ambassador: string, community: string): CommunityRemoved {
    const communityRemovedEvent = changetype<CommunityRemoved>(newMockEvent());

    communityRemovedEvent.parameters = [];
    const ambassadorParam = new ethereum.EventParam(
        'ambassador',
        ethereum.Value.fromAddress(Address.fromString(ambassador))
    );
    const communityParam = new ethereum.EventParam(
        'community',
        ethereum.Value.fromAddress(Address.fromString(community))
    );

    communityRemovedEvent.parameters.push(ambassadorParam);
    communityRemovedEvent.parameters.push(communityParam);

    return communityRemovedEvent;
}
