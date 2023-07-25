import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import { ambassadorAddress, communityAddress, entityAddress } from './utils/constants';
import {
    createAmbassadorAccountReplacedEvent,
    createAmbassadorAddedEvent,
    createAmbassadorRemovedEvent,
    createAmbassadorReplacedEvent,
    createAmbassadorToCommunityUpdatedEvent,
    createAmbassadorTransferedEvent,
    createCommunityRemovedEvent,
    createEntityAccountReplacedEvent,
    createEntityAddedEvent,
    createEntityRemovedEvent
} from './utils/ambassadors';
import {
    handleAmbassadorAccountReplaced,
    handleAmbassadorAdded,
    handleAmbassadorRemoved,
    handleAmbassadorReplaced,
    handleAmbassadorToCommunityUpdated,
    handleAmbassadorTransfered,
    handleCommunityRemoved,
    handleEntityAccountReplaced,
    handleEntityAdded,
    handleEntityRemoved
} from '../src/mappings/ambassadors';

export {
    handleAmbassadorAccountReplaced,
    handleAmbassadorAdded,
    handleAmbassadorRemoved,
    handleAmbassadorReplaced,
    handleAmbassadorToCommunityUpdated,
    handleAmbassadorTransfered,
    handleCommunityRemoved,
    handleEntityAccountReplaced,
    handleEntityAdded,
    handleEntityRemoved
};

// should add entity
// handleEntityAdded(event: EntityAdded)
// createEntityAddedEvent(entity: string): EntityAdded
test('should create entity', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    assert.fieldEquals('AmbassadorsEntityEntity', entityAddress[0], 'status', '0');
});

// should remove entity
// handleEntityRemoved(event: EntityRemoved)
// createEntityRemovedEvent(entity: string): EntityRemoved
test('should remove entity', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const entityRemoved = createEntityRemovedEvent(entityAddress[0]);

    handleEntityRemoved(entityRemoved);

    assert.fieldEquals('AmbassadorsEntityEntity', entityAddress[0], 'status', '1');
});

// should replace entity account
// handleEntityAccountReplaced(event: EntityAccountReplaced)
// createEntityAccountReplacedEvent(entityIndex: i32, oldAccount: string, newAccount: string): EntityAccountReplaced
test('should replace entity account', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const entityAccountReplaced = createEntityAccountReplacedEvent(0, entityAddress[0], entityAddress[1]);

    handleEntityAccountReplaced(entityAccountReplaced);

    assert.notInStore('AmbassadorsEntityEntity', entityAddress[0]);
    assert.fieldEquals('AmbassadorsEntityEntity', entityAddress[1], 'status', '0');
});

// should add ambassador
// handleAmbassadorAdded(event: AmbassadorAdded)
// createAmbassadorAddedEvent(ambassador: string, entity: string): AmbassadorAdded
test('should add ambassador', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const ambassadorAdded = createAmbassadorAddedEvent(ambassadorAddress[0], entityAddress[0]);

    handleAmbassadorAdded(ambassadorAdded);

    assert.fieldEquals('AmbassadorsEntityEntity', entityAddress[0], 'status', '0');
    assert.fieldEquals('AmbassadorEntity', ambassadorAddress[0], 'status', '0');
});

// should remove ambassador
// handleAmbassadorRemoved(event: AmbassadorRemoved)
// createAmbassadorRemovedEvent(ambassador: string, entity: string): AmbassadorRemoved
test('should remove ambassador', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const ambassadorAdded = createAmbassadorAddedEvent(ambassadorAddress[0], entityAddress[0]);

    handleAmbassadorAdded(ambassadorAdded);

    const ambassadorRemoved = createAmbassadorRemovedEvent(ambassadorAddress[0], entityAddress[0]);

    handleAmbassadorRemoved(ambassadorRemoved);

    assert.fieldEquals('AmbassadorsEntityEntity', entityAddress[0], 'status', '0');
    assert.fieldEquals('AmbassadorEntity', ambassadorAddress[0], 'status', '1');
});

// should replace ambassador account
// handleAmbassadorAccountReplaced(event: AmbassadorAccountReplaced)
// createAmbassadorAccountReplacedEvent(ambassadorIndex: i32, entityAccount: string, oldAccount: string, newAccount: string): AmbassadorAccountReplaced
test('should replace ambassador account', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const ambassadorAdded = createAmbassadorAddedEvent(ambassadorAddress[0], entityAddress[0]);

    handleAmbassadorAdded(ambassadorAdded);

    const ambassadorAccountReplaced = createAmbassadorAccountReplacedEvent(
        0,
        entityAddress[0],
        ambassadorAddress[0],
        ambassadorAddress[1]
    );

    handleAmbassadorAccountReplaced(ambassadorAccountReplaced);

    assert.fieldEquals('AmbassadorsEntityEntity', entityAddress[0], 'status', '0');
    assert.fieldEquals('AmbassadorEntity', ambassadorAddress[1], 'status', '0');
    assert.notInStore('AmbassadorEntity', ambassadorAddress[0]);
});

// should replace ambassador
// handleAmbassadorReplaced(event: AmbassadorReplaced)
// createAmbassadorReplacedEvent(ambassadorIndex: i32, entityAccount: string, oldAmbassador: string, newAmbassador: string): AmbassadorReplaced
test('should replace ambassador', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const ambassadorAdded = createAmbassadorAddedEvent(ambassadorAddress[0], entityAddress[0]);

    handleAmbassadorAdded(ambassadorAdded);

    const ambassadorReplaced = createAmbassadorReplacedEvent(
        0,
        entityAddress[0],
        ambassadorAddress[0],
        ambassadorAddress[1]
    );

    handleAmbassadorReplaced(ambassadorReplaced);

    assert.fieldEquals('AmbassadorsEntityEntity', entityAddress[0], 'status', '0');
    assert.fieldEquals('AmbassadorEntity', ambassadorAddress[1], 'status', '0');
    assert.notInStore('AmbassadorEntity', ambassadorAddress[0]);
});

// should transfer ambassador
// handleAmbassadorTransfered(event: AmbassadorTransfered)
// createAmbassadorTransferedEvent(ambassador: string, oldEntity: string, newEntity: string): AmbassadorTransfered
test('should transfer ambassador', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const ambassadorAdded = createAmbassadorAddedEvent(ambassadorAddress[0], entityAddress[0]);

    handleAmbassadorAdded(ambassadorAdded);

    const entityAdded2 = createEntityAddedEvent(entityAddress[1]);

    handleEntityAdded(entityAdded2);

    const ambassadorTransfered = createAmbassadorTransferedEvent(
        ambassadorAddress[0],
        entityAddress[0],
        entityAddress[1]
    );

    handleAmbassadorTransfered(ambassadorTransfered);

    assert.fieldEquals('AmbassadorsEntityEntity', entityAddress[0], 'ambassadors', `[]`);
    assert.fieldEquals('AmbassadorsEntityEntity', entityAddress[1], 'ambassadors', `[${ambassadorAddress[0]}]`);
    assert.fieldEquals('AmbassadorEntity', ambassadorAddress[0], 'status', '0');
});

// should update community to ambassador
// handleAmbassadorToCommunityUpdated(event: AmbassadorToCommunityUpdated)
// createAmbassadorToCommunityUpdatedEvent(fromAmbassador: string, toAmbassador: string, community: string): AmbassadorToCommunityUpdated
test('should update community to ambassador', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const ambassadorAdded = createAmbassadorAddedEvent(ambassadorAddress[0], entityAddress[0]);

    handleAmbassadorAdded(ambassadorAdded);

    const ambassadorToCommunityUpdated = createAmbassadorToCommunityUpdatedEvent(
        '0x0000000000000000000000000000000000000000',
        ambassadorAddress[0],
        communityAddress[0]
    );

    handleAmbassadorToCommunityUpdated(ambassadorToCommunityUpdated);

    assert.fieldEquals('AmbassadorEntity', ambassadorAddress[0], 'communities', `[${communityAddress[0]}]`);
});

// should remove community
// handleCommunityRemoved(event: CommunityRemoved)
// createCommunityRemovedEvent(ambassador: string, community: string): CommunityRemoved
test('should remove community', () => {
    clearStore();

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const ambassadorAdded = createAmbassadorAddedEvent(ambassadorAddress[0], entityAddress[0]);

    handleAmbassadorAdded(ambassadorAdded);

    const ambassadorToCommunityUpdated = createAmbassadorToCommunityUpdatedEvent(
        '0x0000000000000000000000000000000000000000',
        ambassadorAddress[0],
        communityAddress[0]
    );

    handleAmbassadorToCommunityUpdated(ambassadorToCommunityUpdated);

    const communityRemoved = createCommunityRemovedEvent(ambassadorAddress[0], communityAddress[0]);

    handleCommunityRemoved(communityRemoved);

    assert.fieldEquals('AmbassadorEntity', ambassadorAddress[0], 'communities', `[]`);
});

// should remove community without ambassador
// handleCommunityRemoved(event: CommunityRemoved)
// createCommunityRemovedEvent(ambassador: string, community: string): CommunityRemoved
test('should remove community without ambassador', () => {
    // it just should not throw any error, no assert is needed
    clearStore();

    // this is not important here

    const entityAdded = createEntityAddedEvent(entityAddress[0]);

    handleEntityAdded(entityAdded);

    const ambassadorAdded = createAmbassadorAddedEvent(ambassadorAddress[0], entityAddress[0]);

    handleAmbassadorAdded(ambassadorAdded);

    // end of: this is not important here

    const communityRemoved = createCommunityRemovedEvent(
        '0x0000000000000000000000000000000000000000',
        communityAddress[0]
    );

    handleCommunityRemoved(communityRemoved);
});
