import { ImpactMarketCouncilMemberEntity, ProposalEntity } from '../../generated/schema';
import {
    ProposalCanceled,
    ProposalCreated,
    ProposalCreated1,
    ProposalExecuted,
    VoteCast
} from '../../generated/ImpactMarketCouncil/ImpactMarketCouncil';

export function handleProposalCreatedOld(event: ProposalCreated): void {
    const id = `${event.params.id.toString()}`;
    let proposal = ProposalEntity.load(id);

    if (!proposal) {
        proposal = new ProposalEntity(id);
    }
    proposal.createdAt = event.block.timestamp.toI32();
    proposal.proposer = event.params.proposer;
    proposal.signatures = event.params.signatures;
    proposal.calldatas = event.params.calldatas;
    proposal.endBlock = event.params.endBlock.toI32();
    proposal.description = event.params.description;
    proposal.status = 0;
    proposal.votedAgainst = [];
    proposal.votedFor = [];
    proposal.votedAbstain = [];
    proposal.save();
}

export function handleProposalCreated(event: ProposalCreated1): void {
    const id = `${event.params.id.toString()}`;
    let proposal = ProposalEntity.load(id);

    if (!proposal) {
        proposal = new ProposalEntity(id);
    }
    proposal.createdAt = event.block.timestamp.toI32();
    proposal.proposer = event.params.proposer;
    // proposal.targets = event.params.targets;
    proposal.signatures = event.params.signatures;
    proposal.calldatas = event.params.calldatas;
    proposal.endBlock = event.params.endBlock.toI32();
    proposal.description = event.params.description;
    proposal.status = 0;
    proposal.votedAgainst = [];
    proposal.votedFor = [];
    proposal.votedAbstain = [];
    proposal.save();
}

export function handleProposalExecuted(event: ProposalExecuted): void {
    const proposal = ProposalEntity.load(event.params.id.toString());

    if (proposal) {
        proposal.status = 1;
        proposal.save();
    }
}

export function handleProposalCanceled(event: ProposalCanceled): void {
    const proposal = ProposalEntity.load(event.params.id.toString());

    if (proposal) {
        proposal.status = 2;
        proposal.save();
    }
}

export function handleVoteCast(event: VoteCast): void {
    const proposal = ProposalEntity.load(event.params.proposalId.toString());
    const member = ImpactMarketCouncilMemberEntity.load(event.params.voter.toHex());

    if (proposal) {
        switch (event.params.support) {
            case 0:
                const votedAgainst = proposal.votedAgainst;

                votedAgainst.push(event.params.voter);
                proposal.votedAgainst = votedAgainst;
                break;
            case 1:
                const votedFor = proposal.votedFor;

                votedFor.push(event.params.voter);
                proposal.votedFor = votedFor;
                break;
            case 2:
                const votedAbstain = proposal.votedAbstain;

                votedAbstain.push(event.params.voter);
                proposal.votedAbstain = votedAbstain;
                break;
        }
        proposal.save();
    }

    if (member) {
        member.votes++;
        member.save();
    }
}
