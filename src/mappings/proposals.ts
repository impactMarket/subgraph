import {
    ProposalCanceled,
    ProposalCreated,
    ProposalExecuted,
    ProposalQueued,
} from '../../generated/IPCTDelegator/IPCTDelegator';
import { ProposalEntity } from '../../generated/schema';

export function handleProposalCanceled(event: ProposalCanceled): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = ProposalEntity.load(event.params.id.toString());

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!entity) {
        entity = new ProposalEntity(event.params.id.toString());
    }

    // Entity fields can be set based on event parameters
    entity.status = 2;

    // Entities can be written to the store with `.save()`
    entity.save();
}

export function handleProposalCreated(event: ProposalCreated): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = ProposalEntity.load(event.params.id.toString());

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!entity) {
        entity = new ProposalEntity(event.params.id.toString());
    }

    // Entity fields can be set based on event parameters
    entity.status = 0;
    entity.endBlock = event.params.endBlock.toI32();

    // Entities can be written to the store with `.save()`
    entity.save();
}

export function handleProposalExecuted(event: ProposalExecuted): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = ProposalEntity.load(event.params.id.toString());

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!entity) {
        entity = new ProposalEntity(event.params.id.toString());
    }

    // Entity fields can be set based on event parameters
    entity.status = 4;

    // Entities can be written to the store with `.save()`
    entity.save();
}

export function handleProposalQueued(event: ProposalQueued): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = ProposalEntity.load(event.params.id.toString());

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!entity) {
        entity = new ProposalEntity(event.params.id.toString());
    }

    // Entity fields can be set based on event parameters
    entity.status = 3;
    // entity.endBlock = parseInt(event.params.eta.toHex(), 10);

    // Entities can be written to the store with `.save()`
    entity.save();
}
