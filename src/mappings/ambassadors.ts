import { Address, Bytes, store } from '@graphprotocol/graph-ts';
import { Ambassador, AmbassadorsEntity } from '../../generated/schema';
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

export function handleEntityAdded(event: EntityAdded): void {
    const id = `${event.params.entity.toHex()}`;
    let entity = AmbassadorsEntity.load(id);

    if (!entity) {
        entity = new AmbassadorsEntity(id);
    }
    entity.status = 0;
    entity.save();
}

export function handleEntityRemoved(event: EntityRemoved): void {
    const id = `${event.params.entity.toHex()}`;
    const entity = AmbassadorsEntity.load(id)!;

    entity.status = 1;
    entity.save();
}

export function handleEntityAccountReplaced(event: EntityAccountReplaced): void {
    const oldId = `${event.params.oldAccount.toHex()}`;
    const newId = `${event.params.newAccount.toHex()}`;
    const oldEntity = AmbassadorsEntity.load(oldId)!;
    const newEntity = new AmbassadorsEntity(newId);

    newEntity.status = oldEntity.status;
    newEntity.save();

    store.remove('AmbassadorsEntity', oldId);
}

export function handleAmbassadorAdded(event: AmbassadorAdded): void {
    const id = `${event.params.ambassador.toHex()}`;
    let ambassador = Ambassador.load(id);

    if (!ambassador) {
        ambassador = new Ambassador(id);
    }
    ambassador.since = event.block.timestamp.toI32();
    ambassador.entity = event.transaction.from.toHex();
    ambassador.until = 0;
    ambassador.status = 0;
    ambassador.communities = [];
    ambassador.save();
}

export function handleAmbassadorRemoved(event: AmbassadorRemoved): void {
    const id = `${event.params.ambassador.toHex()}`;
    const ambassador = Ambassador.load(id);

    if (ambassador) {
        ambassador.status = 1;
        ambassador.save();
    }
}

export function handleAmbassadorAccountReplaced(event: AmbassadorAccountReplaced): void {
    const oldId = `${event.params.oldAccount.toHex()}`;
    const newId = `${event.params.newAccount.toHex()}`;
    const oldAmbassador = Ambassador.load(oldId)!;
    const newAmbassador = new Ambassador(newId);

    newAmbassador.since = oldAmbassador.since;
    newAmbassador.entity = oldAmbassador.entity;
    newAmbassador.until = oldAmbassador.until;
    newAmbassador.status = oldAmbassador.status;
    newAmbassador.communities = oldAmbassador.communities;
    newAmbassador.save();

    store.remove('Ambassador', oldId);
}

export function handleAmbassadorReplaced(event: AmbassadorReplaced): void {
    const oldId = `${event.params.oldAmbassador.toHex()}`;
    const newId = `${event.params.newAmbassador.toHex()}`;
    const oldAmbassador = Ambassador.load(oldId)!;
    const newAmbassador = new Ambassador(newId);

    newAmbassador.since = oldAmbassador.since;
    newAmbassador.entity = oldAmbassador.entity;
    newAmbassador.until = oldAmbassador.until;
    newAmbassador.status = oldAmbassador.status;
    newAmbassador.communities = oldAmbassador.communities;
    newAmbassador.save();

    store.remove('Ambassador', oldId);
}

export function handleAmbassadorTransfered(event: AmbassadorTransfered): void {
    const id = `${event.params.ambassador.toHex()}`;
    const ambassador = Ambassador.load(id)!;

    ambassador.entity = event.params.newEntity.toHex();

    ambassador.save();
}

export function handleAmbassadorToCommunityUpdated(event: AmbassadorToCommunityUpdated): void {
    if (event.params.fromAmbassador.notEqual(Address.fromString('0x0000000000000000000000000000000000000000'))) {
        const fromId = `${event.params.fromAmbassador.toHex()}`;
        const fromAmbassador = Ambassador.load(fromId)!;
        const communitiesFrom = fromAmbassador.communities;
        const newCommunitiesFrom: Bytes[] = [];

        for (let i = 0; i < communitiesFrom.length; i++) {
            if (communitiesFrom[i].notEqual(event.params.community)) {
                newCommunitiesFrom.push(communitiesFrom[i]);
            }
        }
        fromAmbassador.communities = newCommunitiesFrom;
        fromAmbassador.save();
    }
    const toId = `${event.params.toAmbassador.toHex()}`;
    const toAmbassador = Ambassador.load(toId)!;

    const communitiesTo = toAmbassador.communities;

    communitiesTo.push(event.params.community);
    toAmbassador.communities = communitiesTo;

    toAmbassador.save();
}

export function handleCommunityRemoved(event: CommunityRemoved): void {
    const id = `${event.params.ambassador.toHex()}`;
    const ambassador = Ambassador.load(id);

    // very old communities might not have ambassadors setup
    if (ambassador) {
        const communitiesFrom = ambassador.communities;
        const newCommunitiesFrom: Bytes[] = [];

        for (let i = 0; i < communitiesFrom.length; i++) {
            if (Address.fromString(communitiesFrom[i].toHex()).notEqual(event.params.community)) {
                newCommunitiesFrom.push(communitiesFrom[i]);
            }
        }
        ambassador.communities = newCommunitiesFrom;

        ambassador.save();
    }
}
