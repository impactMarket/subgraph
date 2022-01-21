import { CommunityProposalEntity } from '../../generated/schema';
import {
    ProposalCanceled,
    ProposalCreated,
    ProposalExecuted,
    ProposalQueued
} from '../../generated/PACTDelegator/PACTDelegator';

export function handleProposalCreated(event: ProposalCreated): void {
    const signatures = event.params.signatures;

    for (let index = 0; index < signatures.length; index++) {
        const s = signatures[index];

        if (s.indexOf('addCommunity') !== -1) {
            // TODO: what if there's more than one in a given proposal?
            const id = `${event.params.id.toString()}`;
            let proposal = CommunityProposalEntity.load(id);

            if (!proposal) {
                proposal = new CommunityProposalEntity(id);
            }
            proposal.calldata = event.params.calldatas[index];
            proposal.status = 0;
            proposal.endBlock = event.params.endBlock.toI32();
            proposal.save();
        }
    }
}

export function handleProposalCanceled(event: ProposalCanceled): void {
    const proposal = CommunityProposalEntity.load(event.params.id.toString());

    if (proposal) {
        proposal.status = 2;
        proposal.save();
    }
}

export function handleProposalQueued(event: ProposalQueued): void {
    const proposal = CommunityProposalEntity.load(event.params.id.toString());

    if (proposal) {
        proposal.status = 3;
        proposal.save();
    }
}

export function handleProposalExecuted(event: ProposalExecuted): void {
    const proposal = CommunityProposalEntity.load(event.params.id.toString());

    if (proposal) {
        proposal.status = 4;
        proposal.save();
    }
}
