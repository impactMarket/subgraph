import {
    ProposalCanceled,
    ProposalCreated,
    ProposalExecuted,
    ProposalQueued,
} from '../../generated/PACTDelegator/PACTDelegator';
import { ProposalEntity } from '../../generated/schema';

export function handleProposalCreated(event: ProposalCreated): void {
    let proposal = ProposalEntity.load(event.params.id.toString());
    if (!proposal) {
        proposal = new ProposalEntity(event.params.id.toString());
    }
    const signatures = event.params.signatures;
    const parsedSignatures: string[] = [];
    for (let index = 0; index < signatures.length; index++) {
        const s = signatures[index];
        parsedSignatures.push(s.slice(0, s.indexOf('(')));
    }
    proposal.signatures = parsedSignatures;
    proposal.status = 0;
    proposal.endBlock = event.params.endBlock.toI32();
    proposal.save();
}

export function handleProposalCanceled(event: ProposalCanceled): void {
    const proposal = ProposalEntity.load(event.params.id.toString());
    if (proposal) {
        proposal.status = 2;
        proposal.save();
    }
}

export function handleProposalQueued(event: ProposalQueued): void {
    const proposal = ProposalEntity.load(event.params.id.toString());
    if (proposal) {
        proposal.status = 3;
        proposal.save();
    }
}

export function handleProposalExecuted(event: ProposalExecuted): void {
    const proposal = ProposalEntity.load(event.params.id.toString());
    if (proposal) {
        proposal.status = 4;
        proposal.save();
    }
}
